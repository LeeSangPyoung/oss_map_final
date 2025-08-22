<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" 
                       xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
                       xmlns="http://www.opengis.net/sld" 
                       xmlns:ogc="http://www.opengis.net/ogc" 
                       xmlns:xlink="http://www.w3.org/1999/xlink" 
                       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<NamedLayer>
  <Name>linkSafeWayHomeLayer</Name>
  <UserStyle>
    <Name>linkSafeWayHome</Name>
    <Title>Line</Title>
    <Abstract>A sample style that draws a line</Abstract>
    <FeatureTypeStyle>
            <Rule>
              <Name>rule1</Name>
              <Title>Blue Line</Title>
              <Abstract>A solid line with a 1 pixel width</Abstract>
              <LineSymbolizer>
                <Stroke>
                  <CssParameter name="stroke">#ec5fcc</CssParameter>
                </Stroke>
              </LineSymbolizer>
            </Rule>
    </FeatureTypeStyle>
  </UserStyle>
</NamedLayer>
</StyledLayerDescriptor>