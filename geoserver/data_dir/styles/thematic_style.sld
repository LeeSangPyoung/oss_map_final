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
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>mh_strd_cd</ogc:PropertyName>
                <ogc:Literal>수2</ogc:Literal>
              </ogc:PropertyIsEqualTo>              
            </ogc:And>
          </ogc:Filter>
          <PointSymbolizer>             
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                  <Fill>
                    <CssParameter name="fill">#000000</CssParameter>
                  </Fill>
              </Mark>
              <Size>16</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        <!-- 조건 2: afhd_div_cd = 'H' AND own_cl_cd = 'SKT' -->
        <Rule>
          <Name>TR</Name>
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
              <ogc:Not>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>mh_strd_cd</ogc:PropertyName>
                  <ogc:Literal>수2</ogc:Literal>
                </ogc:PropertyIsEqualTo>
              </ogc:Not>
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
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>