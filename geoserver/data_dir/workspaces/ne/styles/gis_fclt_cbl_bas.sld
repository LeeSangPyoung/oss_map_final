<StyledLayerDescriptor version="1.0.0"
    xmlns="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.opengis.net/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">

    <NamedLayer>
        <Name>cableLayerStyles</Name>
        <UserStyle>
            <Name>MultipleFilterStyles</Name>
            <Title>Styles for Subway, Rent, Underground, FTTH</Title>
            <Abstract>Styles applied based on cbl_ungr_loc_cd and systm_cl_cd</Abstract>

            <!-- 지하철: cbl_ungr_loc_cd='S' AND systm_cl_cd='SK' -->
            <FeatureTypeStyle>
                <Rule>
                    <Name>Subway</Name>
                    <Title>Subway: Black Dashed Line</Title>
                    <ogc:Filter>
                        <ogc:And>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>cbl_ungr_loc_cd</ogc:PropertyName>
                                <ogc:Literal>S</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>systm_cl_cd</ogc:PropertyName>
                                <ogc:Literal>SK</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#000000</CssParameter> <!-- 검은색 -->
                            <CssParameter name="stroke-width">1</CssParameter>
                            <CssParameter name="stroke-dasharray">4 4</CssParameter> <!-- 점선 -->
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

            <!-- 임차: cbl_ungr_loc_cd='B' AND systm_cl_cd='SK' -->
            <FeatureTypeStyle>
                <Rule>
                    <Name>Rent</Name>
                    <Title>Rent: Red Dashed Line</Title>
                    <ogc:Filter>
                        <ogc:And>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>cbl_ungr_loc_cd</ogc:PropertyName>
                                <ogc:Literal>B</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>systm_cl_cd</ogc:PropertyName>
                                <ogc:Literal>SK</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#ffa500</CssParameter> <!-- 빨간색 -->
                            <CssParameter name="stroke-width">10</CssParameter>
                            <CssParameter name="stroke-dasharray">5 2 2 2</CssParameter> <!-- 점선 -->
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

            <!-- 지중: cbl_ungr_loc_cd='D' AND systm_cl_cd='SK' -->
            <FeatureTypeStyle>
                <Rule>
                    <Name>Underground</Name>
                    <Title>Underground: Orange Dashed Line</Title>
                    <ogc:Filter>
                        <ogc:And>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>cbl_ungr_loc_cd</ogc:PropertyName>
                                <ogc:Literal>D</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>systm_cl_cd</ogc:PropertyName>
                                <ogc:Literal>SK</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#000000</CssParameter> <!-- 주황색 -->
                            <CssParameter name="stroke-width">3</CssParameter>
                            <CssParameter name="stroke-dasharray">5 2 2 2</CssParameter> <!-- 점선 -->
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

            <!-- FTTH: cbl_ungr_loc_cd='F' AND systm_cl_cd='SK' -->
            <FeatureTypeStyle>
                <Rule>
                    <Name>FTTH</Name>
                    <Title>FTTH: Pink Solid Line</Title>
                    <ogc:Filter>
                        <ogc:And>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>cbl_ungr_loc_cd</ogc:PropertyName>
                                <ogc:Literal>F</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>systm_cl_cd</ogc:PropertyName>
                                <ogc:Literal>SK</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#ec5fcc</CssParameter> <!-- 분홍색 -->
                            <CssParameter name="stroke-width">2</CssParameter> <!-- 두꺼운 실선 -->
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
          
            <!-- FB(가공): cbl_ungr_loc_cd='A' AND systm_cl_cd='SK' -->
            <FeatureTypeStyle>
                <Rule>
                    <Name>FB</Name>
                    <Title>FB: RED Line</Title>
                    <ogc:Filter>
                        <ogc:And>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>cbl_ungr_loc_cd</ogc:PropertyName>
                                <ogc:Literal>A</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>systm_cl_cd</ogc:PropertyName>
                                <ogc:Literal>SK</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#ff0000</CssParameter> <!-- 분홍색 -->
                            <CssParameter name="stroke-width">1</CssParameter> <!-- 두꺼운 실선 -->
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
            
          <!-- 공틍(가공): cbl_ungr_loc_cd='A' AND systm_cl_cd='CM' -->
            <FeatureTypeStyle>
                <Rule>
                    <Name>CM_A</Name>
                    <Title>FB: RED Line</Title>
                    <ogc:Filter>
                        <ogc:And>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>cbl_ungr_loc_cd</ogc:PropertyName>
                                <ogc:Literal>A</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>systm_cl_cd</ogc:PropertyName>
                                <ogc:Literal>CM</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#006400</CssParameter> <!-- 짙은 녹색 -->
                            <CssParameter name="stroke-width">1</CssParameter> <!-- 두꺼운 실선 -->
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
          
          <!-- 공통(지중): cbl_ungr_loc_cd='D' AND systm_cl_cd='CM' -->
            <FeatureTypeStyle>
                <Rule>
                    <Name>CM_D</Name>
                    <Title>FB: RED Line</Title>
                    <ogc:Filter>
                        <ogc:And>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>cbl_ungr_loc_cd</ogc:PropertyName>
                                <ogc:Literal>D</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>systm_cl_cd</ogc:PropertyName>
                                <ogc:Literal>CM</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#006400</CssParameter> <!-- 짙은 녹색 -->
                            <CssParameter name="stroke-width">1</CssParameter>
                            <CssParameter name="stroke-dasharray">4 4</CssParameter> <!-- 점선 -->
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

          <!-- SKB(지하철): cbl_ungr_loc_cd='S' AND systm_cl_cd='HT' -->
            <FeatureTypeStyle>
                <Rule>
                    <Name>SKB_S</Name>
                    <Title>FB: RED Line</Title>
                    <ogc:Filter>
                        <ogc:And>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>cbl_ungr_loc_cd</ogc:PropertyName>
                                <ogc:Literal>S</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>systm_cl_cd</ogc:PropertyName>
                                <ogc:Literal>HT</ogc:Literal>
                            </ogc:PropertyIsEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#000080</CssParameter> <!-- 파란색 -->
                            <CssParameter name="stroke-width">2</CssParameter>
                            <CssParameter name="stroke-dasharray">10 5</CssParameter> <!-- 점선 -->
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