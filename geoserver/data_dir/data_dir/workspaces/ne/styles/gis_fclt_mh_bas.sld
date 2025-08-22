<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">
  <NamedLayer>
    <Name>gis_fclt_mh_basStyles</Name>
    <UserStyle>
      <Name>MultipleFilterStyles</Name>
      <Title>Styles with icons</Title>
      <Abstract>Styles applied with different icons based on filters</Abstract>
      <FeatureTypeStyle>
        <!-- 조건 1: afhd_div_cd = 'M' AND own_cl_cd = 'SKT' -->
        <Rule>
          <Name>TP</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>afhd_div_cd</ogc:PropertyName>
                <ogc:Literal>M</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                <ogc:Literal>SKT</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsNotEqualTo>
                <ogc:PropertyName>kepbo_no</ogc:PropertyName>
                <ogc:Literal></ogc:Literal>
              </ogc:PropertyIsNotEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PointSymbolizer>             
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="T_MH_M.png" />
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
  </TextSymbolizer>
        </Rule>
        <!-- 조건 2: afhd_div_cd = 'H' AND own_cl_cd = 'SKT' -->
        <Rule>
          <Name>TR</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>afhd_div_cd</ogc:PropertyName>
                <ogc:Literal>H</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                <ogc:Literal>SKT</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsNotEqualTo>
                <ogc:PropertyName>kepbo_no</ogc:PropertyName>
                <ogc:Literal></ogc:Literal>
              </ogc:PropertyIsNotEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="T_MH_H.png" />
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
  </TextSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>