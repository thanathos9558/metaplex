import { useWallet } from '@solana/wallet-adapter-react';
import { Col, Layout, Row, Tabs } from 'antd';
import React, { useState } from 'react';
import Masonry from 'react-masonry-css';

import { useMeta } from '../../../../contexts';
import { CardLoader } from '../../../../components/MyLoader';
import { Banner } from '../../../../components/Banner';
import { HowToBuyModal } from '../../../../components/HowToBuyModal';

import { useSales } from './hooks/useSales';
import SaleCard from './components/SaleCard';

const { TabPane } = Tabs;
const { Content } = Layout;

export enum LiveAuctionViewState {
  All = '0',
  Participated = '1',
  Ended = '2',
  Resale = '3',
}

const breakpointColumnsObj = {
  default: 5,
  1100: 3,
  700: 2,
  500: 1,
};

export const SalesListView = () => {
  const [activeKey, setActiveKey] = useState(LiveAuctionViewState.All);
  const { isLoading } = useMeta();
  const { connected } = useWallet();
  const { sales, hasResaleAuctions } = useSales(activeKey);

  return (
    <>
     
      <Layout>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 1 }}>
            <Row>
              <Tabs
                activeKey={activeKey}
                onTabClick={key => setActiveKey(key as LiveAuctionViewState)}
              >
                <TabPane
                  tab={
                    <>
                      <span className="live"></span> Live
                    </>
                  }
                  key={LiveAuctionViewState.All}
                ></TabPane>
                {hasResaleAuctions && (
                  <TabPane
                    tab="Secondary Marketplace"
                    key={LiveAuctionViewState.Resale}
                  ></TabPane>
                )}
                {connected && (
                  <TabPane
                    tab="Participated"
                    key={LiveAuctionViewState.Participated}
                  ></TabPane>
                )}
              </Tabs>
            </Row>
            <Row>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid"
                columnClassName="masonry-grid_column"
              >
                {isLoading &&
                  [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
                {!isLoading &&
                  sales.map((sale, idx) => <SaleCard sale={sale} key={idx} />)}
              </Masonry>
            </Row>
          </Col>
        </Content>
      </Layout>
      <Banner
        src="/main-banner.png"
        headingText="Great Legendary $GREAT"
        subHeadingText="¡Compra tu cofre, se parte del juego!"
        actionComponent={<HowToBuyModal buttonClassName="secondary-btn" />}
        useBannerBg
      />
    </>
  );
};
