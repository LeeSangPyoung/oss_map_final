<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0"
  xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <NamedLayer>
    <Name>line_with_outline</Name>
    <UserStyle>
      <Title>line_with_outline Separation</Title>
      <FeatureTypeStyle>
        <!-- geom_type = LINE, isOutline = true -->
        <Rule>
          <Title>outline rule</Title>
          <ogc:Filter>
            <ogc:And>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>geom_type</ogc:PropertyName>
                  <ogc:Literal>LINE</ogc:Literal>
                </ogc:PropertyIsEqualTo>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>isoutline</ogc:PropertyName>
                  <ogc:Literal>true</ogc:Literal>
                </ogc:PropertyIsEqualTo>
            </ogc:And>
          </ogc:Filter>
          <LineSymbolizer>
            <Stroke>              
              <CssParameter name="stroke">
                <ogc:PropertyName>outlinecolor</ogc:PropertyName>
              </CssParameter>
              <CssParameter name="stroke-width">
                <ogc:PropertyName>outlineweight</ogc:PropertyName>
              </CssParameter>
              <CssParameter name="stroke-linecap">
                <ogc:PropertyName>outlinecapstyle</ogc:PropertyName>
              </CssParameter>
              <CssParameter name="stroke-linejoin">
                <ogc:PropertyName>outlinejoinstyle</ogc:PropertyName>
              </CssParameter>
              <CssParameter name="stroke-dasharray">
               <ogc:PropertyName>outlinedasharray</ogc:PropertyName>
              </CssParameter>
              <CssParameter name="stroke-opacity">
               <ogc:PropertyName>outlineopacity</ogc:PropertyName>
              </CssParameter>
            </Stroke>
          </LineSymbolizer>
        </Rule>
        <!--  main line rule (geom_type = LINE, isOutline != true)-->
        <Rule>
          <Title>main line rule</Title>
          <ogc:Filter>
            <ogc:And>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>geom_type</ogc:PropertyName>
                  <ogc:Literal>LINE</ogc:Literal>
                </ogc:PropertyIsEqualTo>
              <ogc:Not>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>isoutline</ogc:PropertyName>
                  <ogc:Literal>true</ogc:Literal>
                </ogc:PropertyIsEqualTo>
              </ogc:Not>
            </ogc:And>
          </ogc:Filter>
          <LineSymbolizer>
            <Stroke>              
              <CssParameter name="stroke">
                <ogc:PropertyName>color</ogc:PropertyName>
              </CssParameter>
              <CssParameter name="stroke-width">
                <ogc:PropertyName>weight</ogc:PropertyName>
              </CssParameter>
              <CssParameter name="stroke-linecap">
                <ogc:PropertyName>capstyle</ogc:PropertyName>
              </CssParameter>
              <CssParameter name="stroke-linejoin">
                <ogc:PropertyName>joinstyle</ogc:PropertyName>
              </CssParameter>
              <CssParameter name="stroke-dasharray">
               <ogc:PropertyName>dasharray</ogc:PropertyName>
              </CssParameter>
              <CssParameter name="stroke-opacity">
               <ogc:PropertyName>opacity</ogc:PropertyName>
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