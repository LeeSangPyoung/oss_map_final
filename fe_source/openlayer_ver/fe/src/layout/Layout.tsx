import { Outlet } from 'react-router-dom';

export default function Layout() {
  // const { mode } = useOptions();
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (mode === 'offline') {
  //     navigate('/open-layer');
  //   } else {
  //     navigate('/');
  //   }
  // }, [mode]);
  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
}
