<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">
  <NamedLayer>
    <Name>gis_fclt_cnpt_basStyles</Name>
    <UserStyle>
      <Name>MultipleFilterStyles</Name>
      <Title>Styles with icons</Title>
      <Abstract>Styles applied with different icons based on filters</Abstract>
      <FeatureTypeStyle>
        <!-- 조건 1: cbnt_cl_cd = 'SP' AND own_cl_cd = 'SKT' -->
        <Rule>
          <Name>SP</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>cbnt_cl_cd</ogc:PropertyName>
                <ogc:Literal>SP</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                <ogc:Literal>SKT</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PointSymbolizer>             
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="T_SP.png" />
                <Format>image/png</Format>
              </ExternalGraphic>
              <Size>16</Size>
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
  </TextSymbolizer>
        </Rule>
        <!-- 조건 2: cbnt_cl_cd = 'JE' AND own_cl_cd = 'SKT' -->
        <Rule>
          <Name>JE</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>cbnt_cl_cd</ogc:PropertyName>
                <ogc:Literal>JE</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                <ogc:Literal>SKT</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="T_JE.png" />
                <Format>image/png</Format>
              </ExternalGraphic>
              <Size>16</Size>
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
  </TextSymbolizer>
        </Rule>
        <!-- 조건 3: cbnt_cl_cd = 'GE' AND own_cl_cd = 'SKT' -->
        <Rule>
          <Name>GE</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>cbnt_cl_cd</ogc:PropertyName>
                <ogc:Literal>GE</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                <ogc:Literal>SKT</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="T_GE.png" />
                <Format>image/png</Format>
              </ExternalGraphic>
              <Size>16</Size>
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
  </TextSymbolizer>
        </Rule>
        <!-- 조건 4: cbnt_cl_cd = 'JP' AND own_cl_cd = 'SKT' -->
        <Rule>
          <Name>JP</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>cbnt_cl_cd</ogc:PropertyName>
                <ogc:Literal>JP</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                <ogc:Literal>SKT</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="T_JP.png" />
                <Format>image/png</Format>
              </ExternalGraphic>
              <Size>16</Size>
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
  </TextSymbolizer>
        </Rule>
        <!-- 조건 5: cbnt_cl_cd = '5G' AND own_cl_cd = 'SKT' -->
        <Rule>
          <Name>5G</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>cbnt_cl_cd</ogc:PropertyName>
                <ogc:Literal>5G</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                <ogc:Literal>SKT</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="T_5G.png" />
                <Format>image/png</Format>
              </ExternalGraphic>
              <Size>16</Size>
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
  </TextSymbolizer>
        </Rule>
        <!-- 조건 6: cbnt_cl_cd = 'MA' AND own_cl_cd = 'SKT' -->
        <Rule>
          <Name>MA</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>cbnt_cl_cd</ogc:PropertyName>
                <ogc:Literal>MA</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                <ogc:Literal>SKT</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="T_MA.png" />
                <Format>image/png</Format>
              </ExternalGraphic>
              <Size>16</Size>
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
  </TextSymbolizer>
        </Rule>
        <!-- 조건 7: cbnt_cl_cd = 'HM' AND own_cl_cd = 'SKT' -->
        <Rule>
          <Name>HM</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>cbnt_cl_cd</ogc:PropertyName>
                <ogc:Literal>HM</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                <ogc:Literal>SKT</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="T_HM.png" />
                <Format>image/png</Format>
              </ExternalGraphic>              
              <Size>16</Size>
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
  </TextSymbolizer>
        </Rule>
        <!-- 조건 8: cbnt_cl_cd = 'SB' AND own_cl_cd = 'SKT' -->
        <Rule>
          <Name>SB</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>cbnt_cl_cd</ogc:PropertyName>
                <ogc:Literal>SB</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                <ogc:Literal>SKT</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="T_SB.png" />
                <Format>image/png</Format>
              </ExternalGraphic>
              <Size>16</Size>
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
  </TextSymbolizer>
        </Rule>
        <!-- 조건 9: cbnt_cl_cd = 'HS' AND own_cl_cd = 'SKT' -->
        <Rule>
          <Name>HS</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>cbnt_cl_cd</ogc:PropertyName>
                <ogc:Literal>HS</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                <ogc:Literal>SKT</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="T_HS.png" />
                <Format>image/png</Format>
              </ExternalGraphic>
              <Size>16</Size>
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
  </TextSymbolizer>
        </Rule>
        <!-- 조건 10: cbnt_cl_cd = 'DU' AND own_cl_cd = 'SKT' -->
        <Rule>
          <Name>DU</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>cbnt_cl_cd</ogc:PropertyName>
                <ogc:Literal>DU</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                <ogc:Literal>SKT</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="T_Du.png" />
                <Format>image/png</Format>
              </ExternalGraphic>
              <Size>16</Size>
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
  </TextSymbolizer>
        </Rule>
        <!-- 조건 11: cbnt_cl_cd = 'GR' AND own_cl_cd = 'SKT' -->
        <Rule>
          <Name>GR</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>cbnt_cl_cd</ogc:PropertyName>
                <ogc:Literal>GR</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                <ogc:Literal>SKT</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="T_GR.png" />
                <Format>image/png</Format>
              </ExternalGraphic>
              <Size>16</Size>
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
  </TextSymbolizer>
        </Rule>
        <!-- 조건 12: cbnt_cl_cd = 'GE' AND own_cl_cd = 'ETC' -->
        <Rule>
          <Name>NO</Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>cbnt_cl_cd</ogc:PropertyName>
                <ogc:Literal>GE</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>own_cl_cd</ogc:PropertyName>
                <ogc:Literal>ETC</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="T_NO.png" />
                <Format>image/png</Format>
              </ExternalGraphic>
              <Size>16</Size>
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
  </TextSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>