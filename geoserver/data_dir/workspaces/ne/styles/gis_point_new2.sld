<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0"
  xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <NamedLayer>
    <Name>line_with_outline</Name>
    <UserStyle>
      <Title>line_with_outline Separation</Title>
      <!-- 스타일 0 ~ 4 반복 -->
      <!-- 반복 구조 시작 -->
      <!-- 복사해서 총 5개 (0 ~ 4) 생성 -->
      <FeatureTypeStyle>        
        <Rule>   
          <Name>shape Market</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_0</ogc:PropertyName>
                <ogc:Literal>true</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>markertype_0</ogc:PropertyName>
                <ogc:Literal>shape</ogc:Literal>
              </ogc:PropertyIsEqualTo>  
            </ogc:And>
          </ogc:Filter>
          
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>
                  <ogc:PropertyName>shapetype_0</ogc:PropertyName>
                </WellKnownName>
                <Fill>
                  <CssParameter name="fill">
                    <ogc:PropertyName>fillcolor_0</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="fill-opacity">
                    <ogc:PropertyName>fillopacity_0</ogc:PropertyName>
                  </CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">
                    <ogc:PropertyName>strokecolor_0</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="stroke-width">
                    <ogc:PropertyName>weight_0</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="stroke-opacity">
                    <ogc:PropertyName>opacity_0</ogc:PropertyName>
                  </CssParameter>
                </Stroke>
              </Mark>
              <Size>
                <ogc:PropertyName>size_0</ogc:PropertyName>
              </Size>              
            </Graphic>
          </PointSymbolizer>
          <TextSymbolizer>
            <Label>
              <!-- 표시할 필드 이름 -->
              <ogc:Function name="if_then_else">
                <ogc:Function name="env">
                  <ogc:Literal>showLabel</ogc:Literal>
                  <ogc:Literal>false</ogc:Literal>
                </ogc:Function>
                <ogc:PropertyName>labeltext_0</ogc:PropertyName>
                <ogc:Literal></ogc:Literal>
              </ogc:Function>
            </Label>
            <Font>
              <CssParameter name="font-family">NanumGothic</CssParameter>
              <CssParameter name="font-size">12</CssParameter>
              <CssParameter name="font-style">normal</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.5</AnchorPointX> <!-- 텍스트 기준점 (중앙) -->
                  <AnchorPointY>0.5</AnchorPointY> <!-- 아이콘 위로 배치 -->
                </AnchorPoint>
                <Displacement>
                  <DisplacementX>0</DisplacementX>
                  <DisplacementY>-10</DisplacementY> <!-- 아이콘 위로 15px 이동 -->
                </Displacement>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
              <Radius>1</Radius> <!-- 텍스트 외곽선 -->
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#000000</CssParameter> <!-- 텍스트 색상 -->
            </Fill>
            <VendorOption name="conflictResolution">false</VendorOption>
            <VendorOption name="partials">true</VendorOption>    
        </TextSymbolizer>
        </Rule>	  
        
        <Rule>
          <Title>point rule</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_0</ogc:PropertyName>
                <ogc:Literal>true</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>markertype_0</ogc:PropertyName>
                <ogc:Literal>icon</ogc:Literal>
              </ogc:PropertyIsEqualTo>  
            </ogc:And>
          </ogc:Filter>
          
          <PointSymbolizer>
          <Graphic>
            <ExternalGraphic>
              <OnlineResource xlink:type="simple" xlink:href="icons/${icon_name}.png" />
              <Format>image/png</Format>
            </ExternalGraphic>
            <Size>
              <ogc:PropertyName>size_0</ogc:PropertyName>
            </Size>
          </Graphic>
        </PointSymbolizer>
        <TextSymbolizer>
          <Label>
            <!-- 표시할 필드 이름 -->
            <ogc:Function name="if_then_else">
              <ogc:Function name="env">
                <ogc:Literal>showLabel</ogc:Literal>
                <ogc:Literal>false</ogc:Literal>
              </ogc:Function>
              <ogc:PropertyName>labeltext_0</ogc:PropertyName>
              <ogc:Literal></ogc:Literal>
            </ogc:Function>
          </Label>
          <Font>
            <CssParameter name="font-family">NanumGothic</CssParameter>
            <CssParameter name="font-size">12</CssParameter>
            <CssParameter name="font-style">normal</CssParameter>
            <CssParameter name="font-weight">bold</CssParameter>
          </Font>
          <LabelPlacement>
            <PointPlacement>
              <AnchorPoint>
                <AnchorPointX>0.5</AnchorPointX> <!-- 텍스트 기준점 (중앙) -->
                <AnchorPointY>0.5</AnchorPointY> <!-- 아이콘 위로 배치 -->
              </AnchorPoint>
              <Displacement>
                <DisplacementX>0</DisplacementX>
                <DisplacementY>-10</DisplacementY> <!-- 아이콘 위로 15px 이동 -->
              </Displacement>
            </PointPlacement>
          </LabelPlacement>
          <Halo>
            <Radius>1</Radius> <!-- 텍스트 외곽선 -->
            <Fill>
              <CssParameter name="fill">#FFFFFF</CssParameter>
            </Fill>
          </Halo>
          <Fill>
            <CssParameter name="fill">#000000</CssParameter> <!-- 텍스트 색상 -->
          </Fill>
          <VendorOption name="conflictResolution">false</VendorOption>
          <VendorOption name="partials">true</VendorOption>    
        </TextSymbolizer>
        </Rule>
        
        <Rule>   
          <Name>shape Market</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_1</ogc:PropertyName>
                <ogc:Literal>true</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>markertype_1</ogc:PropertyName>
                <ogc:Literal>shape</ogc:Literal>
              </ogc:PropertyIsEqualTo>  
            </ogc:And>
          </ogc:Filter>
          
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>
                  <ogc:PropertyName>shapetype_1</ogc:PropertyName>
                </WellKnownName>
                <Fill>
                  <CssParameter name="fill">
                    <ogc:PropertyName>fillcolor_1</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="fill-opacity">
                    <ogc:PropertyName>fillopacity_1</ogc:PropertyName>
                  </CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">
                    <ogc:PropertyName>strokecolor_1</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="stroke-width">
                    <ogc:PropertyName>weight_1</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="stroke-opacity">
                    <ogc:PropertyName>opacity_1</ogc:PropertyName>
                  </CssParameter>
                </Stroke>
              </Mark>
              <Size>
                <ogc:PropertyName>size_1</ogc:PropertyName>
              </Size>              
            </Graphic>
          </PointSymbolizer>
          <TextSymbolizer>
            <Label>
              <!-- 표시할 필드 이름 -->
              <ogc:Function name="if_then_else">
                <ogc:Function name="env">
                  <ogc:Literal>showLabel</ogc:Literal>
                  <ogc:Literal>false</ogc:Literal>
                </ogc:Function>
                <ogc:PropertyName>labeltext_1</ogc:PropertyName>
                <ogc:Literal></ogc:Literal>
              </ogc:Function>
            </Label>
            <Font>
              <CssParameter name="font-family">NanumGothic</CssParameter>
              <CssParameter name="font-size">12</CssParameter>
              <CssParameter name="font-style">normal</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.5</AnchorPointX> <!-- 텍스트 기준점 (중앙) -->
                  <AnchorPointY>0.5</AnchorPointY> <!-- 아이콘 위로 배치 -->
                </AnchorPoint>
                <Displacement>
                  <DisplacementX>0</DisplacementX>
                  <DisplacementY>-10</DisplacementY> <!-- 아이콘 위로 15px 이동 -->
                </Displacement>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
              <Radius>1</Radius> <!-- 텍스트 외곽선 -->
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#000000</CssParameter> <!-- 텍스트 색상 -->
            </Fill>
            <VendorOption name="conflictResolution">false</VendorOption>
            <VendorOption name="partials">true</VendorOption>    
        </TextSymbolizer>
        </Rule>	  
        
        <Rule>
          <Title>point rule</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_1</ogc:PropertyName>
                <ogc:Literal>true</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>markertype_1</ogc:PropertyName>
                <ogc:Literal>icon</ogc:Literal>
              </ogc:PropertyIsEqualTo>  
            </ogc:And>
          </ogc:Filter>
          
          <PointSymbolizer>
          <Graphic>
            <ExternalGraphic>
              <OnlineResource xlink:type="simple" xlink:href="icons/${icon_name}.png" />
              <Format>image/png</Format>
            </ExternalGraphic>
            <Size>
              <ogc:PropertyName>size_1</ogc:PropertyName>
            </Size>
          </Graphic>
        </PointSymbolizer>
        <TextSymbolizer>
          <Label>
            <!-- 표시할 필드 이름 -->
            <ogc:Function name="if_then_else">
              <ogc:Function name="env">
                <ogc:Literal>showLabel</ogc:Literal>
                <ogc:Literal>false</ogc:Literal>
              </ogc:Function>
              <ogc:PropertyName>labeltext_1</ogc:PropertyName>
              <ogc:Literal></ogc:Literal>
            </ogc:Function>
          </Label>
          <Font>
            <CssParameter name="font-family">NanumGothic</CssParameter>
            <CssParameter name="font-size">12</CssParameter>
            <CssParameter name="font-style">normal</CssParameter>
            <CssParameter name="font-weight">bold</CssParameter>
          </Font>
          <LabelPlacement>
            <PointPlacement>
              <AnchorPoint>
                <AnchorPointX>0.5</AnchorPointX> <!-- 텍스트 기준점 (중앙) -->
                <AnchorPointY>0.5</AnchorPointY> <!-- 아이콘 위로 배치 -->
              </AnchorPoint>
              <Displacement>
                <DisplacementX>0</DisplacementX>
                <DisplacementY>-10</DisplacementY> <!-- 아이콘 위로 15px 이동 -->
              </Displacement>
            </PointPlacement>
          </LabelPlacement>
          <Halo>
            <Radius>1</Radius> <!-- 텍스트 외곽선 -->
            <Fill>
              <CssParameter name="fill">#FFFFFF</CssParameter>
            </Fill>
          </Halo>
          <Fill>
            <CssParameter name="fill">#000000</CssParameter> <!-- 텍스트 색상 -->
          </Fill>
          <VendorOption name="conflictResolution">false</VendorOption>
          <VendorOption name="partials">true</VendorOption>    
        </TextSymbolizer>
        </Rule>
        
        <Rule>   
          <Name>shape Market</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_2</ogc:PropertyName>
                <ogc:Literal>true</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>markertype_2</ogc:PropertyName>
                <ogc:Literal>shape</ogc:Literal>
              </ogc:PropertyIsEqualTo>  
            </ogc:And>
          </ogc:Filter>
          
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>
                  <ogc:PropertyName>shapetype_2</ogc:PropertyName>
                </WellKnownName>
                <Fill>
                  <CssParameter name="fill">
                    <ogc:PropertyName>fillcolor_2</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="fill-opacity">
                    <ogc:PropertyName>fillopacity_2</ogc:PropertyName>
                  </CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">
                    <ogc:PropertyName>strokecolor_2</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="stroke-width">
                    <ogc:PropertyName>weight_2</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="stroke-opacity">
                    <ogc:PropertyName>opacity_2</ogc:PropertyName>
                  </CssParameter>
                </Stroke>
              </Mark>
              <Size>
                <ogc:PropertyName>size_2</ogc:PropertyName>
              </Size>              
            </Graphic>
          </PointSymbolizer>
          <TextSymbolizer>
            <Label>
              <!-- 표시할 필드 이름 -->
              <ogc:Function name="if_then_else">
                <ogc:Function name="env">
                  <ogc:Literal>showLabel</ogc:Literal>
                  <ogc:Literal>false</ogc:Literal>
                </ogc:Function>
                <ogc:PropertyName>labeltext_2</ogc:PropertyName>
                <ogc:Literal></ogc:Literal>
              </ogc:Function>
            </Label>
            <Font>
              <CssParameter name="font-family">NanumGothic</CssParameter>
              <CssParameter name="font-size">12</CssParameter>
              <CssParameter name="font-style">normal</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.5</AnchorPointX> <!-- 텍스트 기준점 (중앙) -->
                  <AnchorPointY>0.5</AnchorPointY> <!-- 아이콘 위로 배치 -->
                </AnchorPoint>
                <Displacement>
                  <DisplacementX>0</DisplacementX>
                  <DisplacementY>-10</DisplacementY> <!-- 아이콘 위로 15px 이동 -->
                </Displacement>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
              <Radius>1</Radius> <!-- 텍스트 외곽선 -->
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#000000</CssParameter> <!-- 텍스트 색상 -->
            </Fill>
            <VendorOption name="conflictResolution">false</VendorOption>
            <VendorOption name="partials">true</VendorOption>    
        </TextSymbolizer>
        </Rule>	  
        
        <Rule>
          <Title>point rule</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_2</ogc:PropertyName>
                <ogc:Literal>true</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>markertype_2</ogc:PropertyName>
                <ogc:Literal>icon</ogc:Literal>
              </ogc:PropertyIsEqualTo>  
            </ogc:And>
          </ogc:Filter>
          
          <PointSymbolizer>
          <Graphic>
            <ExternalGraphic>
              <OnlineResource xlink:type="simple" xlink:href="icons/${icon_name}.png" />
              <Format>image/png</Format>
            </ExternalGraphic>
            <Size>
              <ogc:PropertyName>size_2</ogc:PropertyName>
            </Size>
          </Graphic>
        </PointSymbolizer>
        <TextSymbolizer>
          <Label>
            <!-- 표시할 필드 이름 -->
            <ogc:Function name="if_then_else">
              <ogc:Function name="env">
                <ogc:Literal>showLabel</ogc:Literal>
                <ogc:Literal>false</ogc:Literal>
              </ogc:Function>
              <ogc:PropertyName>labeltext_2</ogc:PropertyName>
              <ogc:Literal></ogc:Literal>
            </ogc:Function>
          </Label>
          <Font>
            <CssParameter name="font-family">NanumGothic</CssParameter>
            <CssParameter name="font-size">12</CssParameter>
            <CssParameter name="font-style">normal</CssParameter>
            <CssParameter name="font-weight">bold</CssParameter>
          </Font>
          <LabelPlacement>
            <PointPlacement>
              <AnchorPoint>
                <AnchorPointX>0.5</AnchorPointX> <!-- 텍스트 기준점 (중앙) -->
                <AnchorPointY>0.5</AnchorPointY> <!-- 아이콘 위로 배치 -->
              </AnchorPoint>
              <Displacement>
                <DisplacementX>0</DisplacementX>
                <DisplacementY>-10</DisplacementY> <!-- 아이콘 위로 15px 이동 -->
              </Displacement>
            </PointPlacement>
          </LabelPlacement>
          <Halo>
            <Radius>1</Radius> <!-- 텍스트 외곽선 -->
            <Fill>
              <CssParameter name="fill">#FFFFFF</CssParameter>
            </Fill>
          </Halo>
          <Fill>
            <CssParameter name="fill">#000000</CssParameter> <!-- 텍스트 색상 -->
          </Fill>
          <VendorOption name="conflictResolution">false</VendorOption>
          <VendorOption name="partials">true</VendorOption>    
        </TextSymbolizer>
        </Rule>
        
        <Rule>   
          <Name>shape Market</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_3</ogc:PropertyName>
                <ogc:Literal>true</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>markertype_3</ogc:PropertyName>
                <ogc:Literal>shape</ogc:Literal>
              </ogc:PropertyIsEqualTo>  
            </ogc:And>
          </ogc:Filter>
          
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>
                  <ogc:PropertyName>shapetype_3</ogc:PropertyName>
                </WellKnownName>
                <Fill>
                  <CssParameter name="fill">
                    <ogc:PropertyName>fillcolor_3</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="fill-opacity">
                    <ogc:PropertyName>fillopacity_3</ogc:PropertyName>
                  </CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">
                    <ogc:PropertyName>strokecolor_3</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="stroke-width">
                    <ogc:PropertyName>weight_3</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="stroke-opacity">
                    <ogc:PropertyName>opacity_3</ogc:PropertyName>
                  </CssParameter>
                </Stroke>
              </Mark>
              <Size>
                <ogc:PropertyName>size_3</ogc:PropertyName>
              </Size>              
            </Graphic>
          </PointSymbolizer>
          <TextSymbolizer>
            <Label>
              <!-- 표시할 필드 이름 -->
              <ogc:Function name="if_then_else">
                <ogc:Function name="env">
                  <ogc:Literal>showLabel</ogc:Literal>
                  <ogc:Literal>false</ogc:Literal>
                </ogc:Function>
                <ogc:PropertyName>labeltext_3</ogc:PropertyName>
                <ogc:Literal></ogc:Literal>
              </ogc:Function>
            </Label>
            <Font>
              <CssParameter name="font-family">NanumGothic</CssParameter>
              <CssParameter name="font-size">12</CssParameter>
              <CssParameter name="font-style">normal</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.5</AnchorPointX> <!-- 텍스트 기준점 (중앙) -->
                  <AnchorPointY>0.5</AnchorPointY> <!-- 아이콘 위로 배치 -->
                </AnchorPoint>
                <Displacement>
                  <DisplacementX>0</DisplacementX>
                  <DisplacementY>-10</DisplacementY> <!-- 아이콘 위로 15px 이동 -->
                </Displacement>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
              <Radius>1</Radius> <!-- 텍스트 외곽선 -->
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#000000</CssParameter> <!-- 텍스트 색상 -->
            </Fill>
            <VendorOption name="conflictResolution">false</VendorOption>
            <VendorOption name="partials">true</VendorOption>    
        </TextSymbolizer>
        </Rule>	  
        
        <Rule>
          <Title>point rule</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_3</ogc:PropertyName>
                <ogc:Literal>true</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>markertype_3</ogc:PropertyName>
                <ogc:Literal>icon</ogc:Literal>
              </ogc:PropertyIsEqualTo>  
            </ogc:And>
          </ogc:Filter>
          
          <PointSymbolizer>
          <Graphic>
            <ExternalGraphic>
              <OnlineResource xlink:type="simple" xlink:href="icons/${icon_name}.png" />
              <Format>image/png</Format>
            </ExternalGraphic>
            <Size>
              <ogc:PropertyName>size_3</ogc:PropertyName>
            </Size>
          </Graphic>
        </PointSymbolizer>
        <TextSymbolizer>
          <Label>
            <!-- 표시할 필드 이름 -->
            <ogc:Function name="if_then_else">
              <ogc:Function name="env">
                <ogc:Literal>showLabel</ogc:Literal>
                <ogc:Literal>false</ogc:Literal>
              </ogc:Function>
              <ogc:PropertyName>labeltext_3</ogc:PropertyName>
              <ogc:Literal></ogc:Literal>
            </ogc:Function>
          </Label>
          <Font>
            <CssParameter name="font-family">NanumGothic</CssParameter>
            <CssParameter name="font-size">12</CssParameter>
            <CssParameter name="font-style">normal</CssParameter>
            <CssParameter name="font-weight">bold</CssParameter>
          </Font>
          <LabelPlacement>
            <PointPlacement>
              <AnchorPoint>
                <AnchorPointX>0.5</AnchorPointX> <!-- 텍스트 기준점 (중앙) -->
                <AnchorPointY>0.5</AnchorPointY> <!-- 아이콘 위로 배치 -->
              </AnchorPoint>
              <Displacement>
                <DisplacementX>0</DisplacementX>
                <DisplacementY>-10</DisplacementY> <!-- 아이콘 위로 15px 이동 -->
              </Displacement>
            </PointPlacement>
          </LabelPlacement>
          <Halo>
            <Radius>1</Radius> <!-- 텍스트 외곽선 -->
            <Fill>
              <CssParameter name="fill">#FFFFFF</CssParameter>
            </Fill>
          </Halo>
          <Fill>
            <CssParameter name="fill">#000000</CssParameter> <!-- 텍스트 색상 -->
          </Fill>
          <VendorOption name="conflictResolution">false</VendorOption>
          <VendorOption name="partials">true</VendorOption>    
        </TextSymbolizer>
        </Rule>
        
        <Rule>   
          <Name>shape Market</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_4</ogc:PropertyName>
                <ogc:Literal>true</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>markertype_4</ogc:PropertyName>
                <ogc:Literal>shape</ogc:Literal>
              </ogc:PropertyIsEqualTo>  
            </ogc:And>
          </ogc:Filter>
          
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>
                  <ogc:PropertyName>shapetype_4</ogc:PropertyName>
                </WellKnownName>
                <Fill>
                  <CssParameter name="fill">
                    <ogc:PropertyName>fillcolor_4</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="fill-opacity">
                    <ogc:PropertyName>fillopacity_4</ogc:PropertyName>
                  </CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">
                    <ogc:PropertyName>strokecolor_4</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="stroke-width">
                    <ogc:PropertyName>weight_4</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="stroke-opacity">
                    <ogc:PropertyName>opacity_4</ogc:PropertyName>
                  </CssParameter>
                </Stroke>
              </Mark>
              <Size>
                <ogc:PropertyName>size_4</ogc:PropertyName>
              </Size>              
            </Graphic>
          </PointSymbolizer>
          <TextSymbolizer>
            <Label>
              <!-- 표시할 필드 이름 -->
              <ogc:Function name="if_then_else">
                <ogc:Function name="env">
                  <ogc:Literal>showLabel</ogc:Literal>
                  <ogc:Literal>false</ogc:Literal>
                </ogc:Function>
                <ogc:PropertyName>labeltext_4</ogc:PropertyName>
                <ogc:Literal></ogc:Literal>
              </ogc:Function>
            </Label>
            <Font>
              <CssParameter name="font-family">NanumGothic</CssParameter>
              <CssParameter name="font-size">12</CssParameter>
              <CssParameter name="font-style">normal</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.5</AnchorPointX> <!-- 텍스트 기준점 (중앙) -->
                  <AnchorPointY>0.5</AnchorPointY> <!-- 아이콘 위로 배치 -->
                </AnchorPoint>
                <Displacement>
                  <DisplacementX>0</DisplacementX>
                  <DisplacementY>-10</DisplacementY> <!-- 아이콘 위로 15px 이동 -->
                </Displacement>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
              <Radius>1</Radius> <!-- 텍스트 외곽선 -->
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#000000</CssParameter> <!-- 텍스트 색상 -->
            </Fill>
            <VendorOption name="conflictResolution">false</VendorOption>
            <VendorOption name="partials">true</VendorOption>    
        </TextSymbolizer>
        </Rule>	  
        
        <Rule>
          <Title>point rule</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_4</ogc:PropertyName>
                <ogc:Literal>true</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>markertype_4</ogc:PropertyName>
                <ogc:Literal>icon</ogc:Literal>
              </ogc:PropertyIsEqualTo>  
            </ogc:And>
          </ogc:Filter>
          
          <PointSymbolizer>
          <Graphic>
            <ExternalGraphic>
              <OnlineResource xlink:type="simple" xlink:href="icons/${icon_name}.png" />
              <Format>image/png</Format>
            </ExternalGraphic>
            <Size>
              <ogc:PropertyName>size_4</ogc:PropertyName>
            </Size>
          </Graphic>
        </PointSymbolizer>
        <TextSymbolizer>
          <Label>
            <!-- 표시할 필드 이름 -->
            <ogc:Function name="if_then_else">
              <ogc:Function name="env">
                <ogc:Literal>showLabel</ogc:Literal>
                <ogc:Literal>false</ogc:Literal>
              </ogc:Function>
              <ogc:PropertyName>labeltext_4</ogc:PropertyName>
              <ogc:Literal></ogc:Literal>
            </ogc:Function>
          </Label>
          <Font>
            <CssParameter name="font-family">NanumGothic</CssParameter>
            <CssParameter name="font-size">12</CssParameter>
            <CssParameter name="font-style">normal</CssParameter>
            <CssParameter name="font-weight">bold</CssParameter>
          </Font>
          <LabelPlacement>
            <PointPlacement>
              <AnchorPoint>
                <AnchorPointX>0.5</AnchorPointX> <!-- 텍스트 기준점 (중앙) -->
                <AnchorPointY>0.5</AnchorPointY> <!-- 아이콘 위로 배치 -->
              </AnchorPoint>
              <Displacement>
                <DisplacementX>0</DisplacementX>
                <DisplacementY>-10</DisplacementY> <!-- 아이콘 위로 15px 이동 -->
              </Displacement>
            </PointPlacement>
          </LabelPlacement>
          <Halo>
            <Radius>1</Radius> <!-- 텍스트 외곽선 -->
            <Fill>
              <CssParameter name="fill">#FFFFFF</CssParameter>
            </Fill>
          </Halo>
          <Fill>
            <CssParameter name="fill">#000000</CssParameter> <!-- 텍스트 색상 -->
          </Fill>
          <VendorOption name="conflictResolution">false</VendorOption>
          <VendorOption name="partials">true</VendorOption>    
        </TextSymbolizer>
        </Rule>
        
        <!-- 기본값 -->
        
        <Rule>   
          <Name>shape Market</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_0</ogc:PropertyName>
                <ogc:Literal>false</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_1</ogc:PropertyName>
                <ogc:Literal>false</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_2</ogc:PropertyName>
                <ogc:Literal>false</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_3</ogc:PropertyName>
                <ogc:Literal>false</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_4</ogc:PropertyName>
                <ogc:Literal>false</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>markertype_default</ogc:PropertyName>
                <ogc:Literal>shape</ogc:Literal>
              </ogc:PropertyIsEqualTo>  
            </ogc:And>
          </ogc:Filter>
          
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>
                  <ogc:PropertyName>shapetype_default</ogc:PropertyName>
                </WellKnownName>
                <Fill>
                  <CssParameter name="fill">
                    <ogc:PropertyName>fillcolor_default</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="fill-opacity">
                    <ogc:PropertyName>fillopacity_default</ogc:PropertyName>
                  </CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">
                    <ogc:PropertyName>strokecolor_default</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="stroke-width">
                    <ogc:PropertyName>weight_default</ogc:PropertyName>
                  </CssParameter>
                  <CssParameter name="stroke-opacity">
                    <ogc:PropertyName>opacity_default</ogc:PropertyName>
                  </CssParameter>
                </Stroke>
              </Mark>
              <Size>
                <ogc:PropertyName>size_default</ogc:PropertyName>
              </Size>              
            </Graphic>
          </PointSymbolizer>
          <TextSymbolizer>
            <Label>
              <!-- 표시할 필드 이름 -->
              <ogc:Function name="if_then_else">
                <ogc:Function name="env">
                  <ogc:Literal>showLabel</ogc:Literal>
                  <ogc:Literal>false</ogc:Literal>
                </ogc:Function>
                <ogc:PropertyName>labeltext_default</ogc:PropertyName>
                <ogc:Literal></ogc:Literal>
              </ogc:Function>
            </Label>
            <Font>
              <CssParameter name="font-family">NanumGothic</CssParameter>
              <CssParameter name="font-size">12</CssParameter>
              <CssParameter name="font-style">normal</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.5</AnchorPointX> <!-- 텍스트 기준점 (중앙) -->
                  <AnchorPointY>0.5</AnchorPointY> <!-- 아이콘 위로 배치 -->
                </AnchorPoint>
                <Displacement>
                  <DisplacementX>0</DisplacementX>
                  <DisplacementY>-10</DisplacementY> <!-- 아이콘 위로 15px 이동 -->
                </Displacement>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
              <Radius>1</Radius> <!-- 텍스트 외곽선 -->
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#000000</CssParameter> <!-- 텍스트 색상 -->
            </Fill>
            <VendorOption name="conflictResolution">false</VendorOption>
            <VendorOption name="partials">true</VendorOption>    
        </TextSymbolizer>
        </Rule>
        
        <Rule>
          <Title>point rule</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_0</ogc:PropertyName>
                <ogc:Literal>false</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_1</ogc:PropertyName>
                <ogc:Literal>false</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_2</ogc:PropertyName>
                <ogc:Literal>false</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_3</ogc:PropertyName>
                <ogc:Literal>false</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>is_style_4</ogc:PropertyName>
                <ogc:Literal>false</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>markertype_default</ogc:PropertyName>
                <ogc:Literal>icon</ogc:Literal>
              </ogc:PropertyIsEqualTo>  
            </ogc:And>
          </ogc:Filter>
          
          <PointSymbolizer>
          <Graphic>
            <ExternalGraphic>
              <OnlineResource xlink:type="simple" xlink:href="icons/${icon_name_default}.png" />
              <Format>image/png</Format>
            </ExternalGraphic>
            <Size>
              <ogc:PropertyName>size_default</ogc:PropertyName>
            </Size>
          </Graphic>
        </PointSymbolizer>
        <TextSymbolizer>
          <Label>
            <!-- 표시할 필드 이름 -->
            <ogc:Function name="if_then_else">
              <ogc:Function name="env">
                <ogc:Literal>showLabel</ogc:Literal>
                <ogc:Literal>false</ogc:Literal>
              </ogc:Function>
              <ogc:PropertyName>labeltext_default</ogc:PropertyName>
              <ogc:Literal></ogc:Literal>
            </ogc:Function>
          </Label>
          <Font>
            <CssParameter name="font-family">NanumGothic</CssParameter>
            <CssParameter name="font-size">12</CssParameter>
            <CssParameter name="font-style">normal</CssParameter>
            <CssParameter name="font-weight">bold</CssParameter>
          </Font>
          <LabelPlacement>
            <PointPlacement>
              <AnchorPoint>
                <AnchorPointX>0.5</AnchorPointX> <!-- 텍스트 기준점 (중앙) -->
                <AnchorPointY>0.5</AnchorPointY> <!-- 아이콘 위로 배치 -->
              </AnchorPoint>
              <Displacement>
                <DisplacementX>0</DisplacementX>
                <DisplacementY>-10</DisplacementY> <!-- 아이콘 위로 15px 이동 -->
              </Displacement>
            </PointPlacement>
          </LabelPlacement>
          <Halo>
            <Radius>1</Radius> <!-- 텍스트 외곽선 -->
            <Fill>
              <CssParameter name="fill">#FFFFFF</CssParameter>
            </Fill>
          </Halo>
          <Fill>
            <CssParameter name="fill">#000000</CssParameter> <!-- 텍스트 색상 -->
          </Fill>
          <VendorOption name="conflictResolution">false</VendorOption>
          <VendorOption name="partials">true</VendorOption>    
        </TextSymbolizer>
        </Rule>
      </FeatureTypeStyle>
      <!-- 반복 구조 끝 -->
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>