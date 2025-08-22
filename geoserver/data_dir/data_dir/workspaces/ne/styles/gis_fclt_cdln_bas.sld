<StyledLayerDescriptor version="1.0.0"
    xmlns="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.opengis.net/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">

    <NamedLayer>
        <Name>gis_fclt_cdln_basStyles</Name>
        <UserStyle>
            <Name>MultipleFilterStyles</Name>
            <Title>Styles for STK, ETC </Title>
            <Abstract>Styles applied based on own_cl_cd and systm_cl_cd</Abstract>

            <!-- 자가: own_cl_cd='SKT' AND systm_cl_cd='SK' -->
            <FeatureTypeStyle>
                <Rule>
                    <Name>SKT</Name>
                    <Title>SKT: ORANGE Line</Title>
                    <ogc:Filter>
                        <ogc:And>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                                <ogc:Literal>SKT</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>systm_cl_cd</ogc:PropertyName>
                                <ogc:Literal>SK</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#666666</CssParameter>
                            <CssParameter name="stroke-width">9</CssParameter>
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
  </TextSymbolizer>
                </Rule>
                <Rule>
                    <Name>SKT</Name>
                    <Title>SKT: main Line</Title>
                    <ogc:Filter>
                        <ogc:And>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                                <ogc:Literal>SKT</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>systm_cl_cd</ogc:PropertyName>
                                <ogc:Literal>SK</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#ffcc66</CssParameter>
                            <CssParameter name="stroke-width">7</CssParameter>
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
  </TextSymbolizer>
                </Rule> 
            </FeatureTypeStyle>

            <!--타사: own_cl_cd='ETC' AND systm_cl_cd='SK' -->
            <FeatureTypeStyle>
                <Rule>
                    <Name>ETC</Name>
                    <Title>ETC: ORAGNE Dashed Line</Title>
                    <ogc:Filter>
                        <ogc:And>
                            <ogc:PropertyIsNotEqualTo>
                                <ogc:PropertyName>prpty_own_div_cd</ogc:PropertyName>
                                <ogc:Literal>0</ogc:Literal>
                            </ogc:PropertyIsNotEqualTo>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>systm_cl_cd</ogc:PropertyName>
                                <ogc:Literal>SK</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#000000</CssParameter> <!-- 빨간색 -->
                            <CssParameter name="stroke-width">6</CssParameter>                            
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
  </TextSymbolizer>
                </Rule>
                <Rule>
                    <Name>ETC</Name>
                    <Title>ETC: main Dashed Line</Title>
                    <ogc:Filter>
                        <ogc:And>
                             <ogc:Or>
                                <ogc:PropertyIsNotEqualTo>
                                    <ogc:PropertyName>prpty_own_div_cd</ogc:PropertyName>
                                    <ogc:Literal>0</ogc:Literal>
                                </ogc:PropertyIsNotEqualTo>                                  
                                <ogc:PropertyIsNull>
                                    <ogc:PropertyName>prpty_own_div_cd</ogc:PropertyName>                                    
                                 </ogc:PropertyIsNull>                                
                             </ogc:Or>                            
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>systm_cl_cd</ogc:PropertyName>
                                <ogc:Literal>SK</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#FFA500</CssParameter> <!-- 빨간색 -->
                            <CssParameter name="stroke-width">4</CssParameter>
                            <CssParameter name="stroke-dasharray">10 2</CssParameter> <!-- 점선 -->
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
  </TextSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
</StyledLayerDescriptor>