type Type = string;
type Id = number;
type Listener = (payload: any) => void;
interface Events<TListener> {
  [type: string]: { id: Id; listener: TListener }[];
}
export default class Emitter<TType extends Type, TListener extends Listener, TPayload = any> {
  public events: Events<TListener> = {};
  public id: Id = 1;
  public emit(type: TType, payload?: TPayload) {
    if (this.events[type]) {
      this.events[type].forEach(({ listener }) => {
        listener(payload);
      });
    }
  }
  public on(type: TType, listener: TListener) {
    const id: Id = ++this.id;
    this.events = {
      ...this.events,
      [type]: [...(this.events[type] || []), { listener, id }],
    };
    return id;
  }
  public once(type: TType, listener: TListener) {
    const id: Id = ++this.id;
    this.events = { ...this.events, [type]: [{ listener, id }] };
    return id;
  }
  public off(id: Id) {
    this.events = Object.keys(this.events).reduce((obj, key) => {
      return {
        ...obj,
        [key]: this.events[key].filter(item => item.id !== id),
      };
    }, {});
  }
  public offReference(type: TType, listener: TListener) {
    if (this.events[type]) {
      this.events[type] = this.events[type].filter(item => {
        return item.listener !== listener;
      });
    }
  }
  public offEvent(type: TType) {
    if (this.events[type]) {
      this.events = Object.keys(this.events).reduce((obj, key) => {
        return { ...obj, ...(key === type ? {} : { [key]: this.events[key] }) };
      }, {});
    }
  }
}
