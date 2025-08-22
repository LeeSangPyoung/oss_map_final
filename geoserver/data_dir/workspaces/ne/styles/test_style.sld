<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">
  <NamedLayer>
    <Name>gis_mtso_baseStyles</Name>
    <UserStyle>
      <Name>MultipleFilterStyles</Name>
      <Title>Styles with icons</Title>
      <Abstract>Styles applied with different icons based on filters</Abstract>
      <FeatureTypeStyle>
       
        <!-- T_국소 -->
        <Rule>
          <Name>T_국소</Name>
          <ogc:Filter>            
              <ogc:PropertyIsEqualTo>
                <ogc:Function name="env">
                  <ogc:Literal>LayerNm</ogc:Literal>
                  <ogc:Literal>NONE</ogc:Literal>
                </ogc:Function>
                <ogc:Literal>T_SMTSO</ogc:Literal>
              </ogc:PropertyIsEqualTo>             
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                  <OnlineResource xlink:type="simple" xlink:href="T_TS.png" />
                <Format>image/png</Format>
              </ExternalGraphic>
              <Size>16</Size>
            </Graphic>            
          </PointSymbolizer>
           <!-- 텍스트(이름) 표시 -->
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