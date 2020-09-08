import { Button, Table, Card, Form, Rate, Menu, Dropdown, Modal, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect, Link } from 'umi';
import styles from './style.less';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';

export const TableList = (props) => {
  const {
    loading,
    dispatch,
    history,
    ListTableList: { list },
  } = props;
  const [page, setPage] = useState(1);

  const handleButtonClick = ({ key }, record) => {
    switch (key) {
      case '0':
        Modal.confirm({
          title: 'Confirmation',
          content: 'Are you sure delete this news?',
          onOk() {
            dispatch({
              type: 'ListTableList/deleteNews',
              payload: record.newsId,
              callback: (res) => {
                if (res == '') {
                  message.success('success');
                  getData();
                } else {
                  message.error('error');
                }
              },
            });
          },
        });
        break;
      case '1':
        history.push('/edit/' + record.newsId)
        break;

      default:
        break;
    }
  };

  const menu = (record) => {
    return (
      <Menu onClick={(val) => handleButtonClick(val, record)}>
        <Menu.Item key="0">
          <DeleteOutlined />
          delete
        </Menu.Item>
        <Menu.Item key="1">
          <EditOutlined />
          edit
        </Menu.Item>
      </Menu>
    );
  };
  const columns = [
    {
      title: 'news',
      dataIndex: 'news',
      key: 'news',
      render: (_, record) => (
        <div className={styles.item}>
          <div className="ant-list-item">
            <div className="ant-list-item-main">
              <div className="ant-list-item-meta">
                <h4 className="ant-list-item-meta-title">{record.headline}</h4>
              </div>
              <Form>
                <Form.Item label="Last Updated">{record.updatedDate}</Form.Item>
                <Form.Item label="Publish Date">{record.sourcePublishDate}</Form.Item>
                <Form.Item label="Source">{record.source.source}</Form.Item>
                <Form.Item label="Category">{join(record.categories, 'category')}</Form.Item>
                {/* <Form.Item label="Region">{join(record.regions, 'name')}</Form.Item> */}
                <Form.Item label="News Link">
                  <a href={record.link} target="_blank">
                    {record.link}
                  </a>
                </Form.Item>
                <Form.Item label="Rating">
                  <Rate disabled />
                </Form.Item>
              </Form>
            </div>
            <div className="ant-list-item-extra">
              <img width="300" src={record.bannerImage} />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'option',
      key: 'xoption',
      render: (_, record) => (
        <Dropdown overlay={menu(record)} placement="bottomLeft">
          <Button type="primary" icon={<DownOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const getData = page => {
    dispatch({
      type: 'ListTableList/fetch',
      payload: {
        page: page,
        pageSize: 10,
      },
    });
  };
  const currentPage = (page) => {
    setPage(page);
    getData(page);
  };
  useEffect(() => {
    getData(1);
  }, []);

  const join = (data, type) => {
    let arr = [];
    data.forEach((item) => {
      arr.push(item[type]);
    });
    return arr.join();
  };

  return (
    <PageContainer>
      <Card
        style={{ marginTop: 16 }}
        type="inner"
        title={<div></div>}
        extra={
          <Button type="primary" onClick={() => history.push('/news')}>
            Add
          </Button>
        }
      >
        <Table
          columns={columns}
          pagination={{
            current: page,
            showSizeChanger: false,
            total: list.totalCount,
            onChange: (page) => currentPage(page),
          }}
          dataSource={list.list}
          loading={loading}
          rowKey="newsId"
        />
      </Card>
    </PageContainer>
  );
};

export default connect(({ ListTableList, loading }) => ({
  ListTableList,
  loading: loading.models.ListTableList,
}))(TableList);
