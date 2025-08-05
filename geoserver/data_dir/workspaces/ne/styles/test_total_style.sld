<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0"
  xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <NamedLayer>
    <Name>test_total_style</Name>
    <UserStyle>
      <Title>A dark yellow line style</Title>
      <FeatureTypeStyle>
                <!--  Point 전용 Rule -->
        <Rule>
          <Title>point rule</Title>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>geom_type</ogc:PropertyName>
              <ogc:Literal>POINT</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter> 
          <PointSymbolizer>
          <Graphic>
            <ExternalGraphic>
              <OnlineResource xlink:type="simple" xlink:href="icons/${icon_name}.png" />
              <Format>image/png</Format>
            </ExternalGraphic>
            <Size>
              <ogc:Function name="env">
                <ogc:Literal>iconSize</ogc:Literal>
                <ogc:Literal>16</ogc:Literal>
              </ogc:Function>
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
              <ogc:PropertyName>fclt_nm</ogc:PropertyName>
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
          <Title>line rule</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>geom_type</ogc:PropertyName>
                <ogc:Literal>LINE</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsNull>
                  <ogc:PropertyName>outlinecolor</ogc:PropertyName>
              </ogc:PropertyIsNull>
            </ogc:And>
          </ogc:Filter>
          <LineSymbolizer>
            <Stroke>              
              <CssParameter name="stroke">
                <ogc:PropertyName>stylecolor</ogc:PropertyName>
              </CssParameter>
              <CssParameter name="stroke-width">
                <ogc:Function name="env">
                  <ogc:Literal>weight</ogc:Literal>
                  <ogc:Literal>7</ogc:Literal>
                </ogc:Function>              
              </CssParameter>
              <CssParameter name="stroke-linecap">
                <ogc:Function name="env">
                  <ogc:Literal>lineCap</ogc:Literal>
                  <ogc:Literal>round</ogc:Literal>
                </ogc:Function>
              </CssParameter>
              <CssParameter name="stroke-linejoin">
                <ogc:Function name="env">
                  <ogc:Literal>linejoin</ogc:Literal>
                  <ogc:Literal>round</ogc:Literal>
                </ogc:Function>
              </CssParameter>
              <CssParameter name="stroke-dasharray">
               <ogc:PropertyName>dash_style</ogc:PropertyName>
              </CssParameter>
            </Stroke>
          </LineSymbolizer>
          <TextSymbolizer>
          <Label>
            <!-- 표시할 필드 이름 -->
            <ogc:Function name="if_then_else">
              <ogc:Function name="env">
                <ogc:Literal>showLabel</ogc:Literal>
                <ogc:Literal>false</ogc:Literal>
              </ogc:Function>
              <ogc:PropertyName>fclt_nm</ogc:PropertyName>
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
          <Title>outline rule</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>geom_type</ogc:PropertyName>
                <ogc:Literal>LINE</ogc:Literal>
              </ogc:PropertyIsEqualTo>              
              <ogc:Not>
              <ogc:PropertyIsNull>
                <ogc:PropertyName>outlinecolor</ogc:PropertyName>
              </ogc:PropertyIsNull>
              </ogc:Not>
            </ogc:And>
          </ogc:Filter>
          <LineSymbolizer>
            <Stroke>              
              <CssParameter name="stroke">
                <ogc:PropertyName>outlinecolor</ogc:PropertyName>
              </CssParameter>
              <CssParameter name="stroke-width">
                <ogc:Function name="env">
                  <ogc:Literal>outlineWeight</ogc:Literal>
                  <ogc:Literal>7</ogc:Literal>
                </ogc:Function>              
              </CssParameter>              
            </Stroke>
          </LineSymbolizer>
          
          <LineSymbolizer>
            <Stroke>              
              <CssParameter name="stroke">
                <ogc:PropertyName>stylecolor</ogc:PropertyName>
              </CssParameter>
              <CssParameter name="stroke-width">
                <ogc:Function name="env">
                  <ogc:Literal>weight</ogc:Literal>
                  <ogc:Literal>7</ogc:Literal>
                </ogc:Function>              
              </CssParameter>
              <CssParameter name="stroke-linecap">
                <ogc:Function name="env">
                  <ogc:Literal>lineCap</ogc:Literal>
                  <ogc:Literal>round</ogc:Literal>
                </ogc:Function>
              </CssParameter>
              <CssParameter name="stroke-linejoin">
                <ogc:Function name="env">
                  <ogc:Literal>linejoin</ogc:Literal>
                  <ogc:Literal>round</ogc:Literal>
                </ogc:Function>
              </CssParameter>
              <CssParameter name="stroke-dasharray">
               <ogc:PropertyName>dash_style</ogc:PropertyName>
              </CssParameter>
            </Stroke>
          </LineSymbolizer>
          
          <TextSymbolizer>
          <Label>
            <!-- 표시할 필드 이름 -->
            <ogc:Function name="if_then_else">
              <ogc:Function name="env">
                <ogc:Literal>showLabel</ogc:Literal>
                <ogc:Literal>false</ogc:Literal>
              </ogc:Function>
              <ogc:PropertyName>fclt_nm</ogc:PropertyName>
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
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>