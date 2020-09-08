import { Button, Card, DatePicker, Input, Form, Upload, Select, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { connect, useParams } from 'umi';
import moment from 'moment';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import FroalaEditorComponent from 'react-froala-wysiwyg';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

export const BasicForm = (props) => {
  const {
    history,
    submitting,
    getInfoting,
    dispatch,
    route,
    newsForm: { Categories, Regions, States, Sources },
  } = props;
  const params = useParams()
  const [form] = Form.useForm();
  const [editorState, setEditorState] = useState('');
  const [fileList, setfileList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [pdfList, setPDFList] = useState([]);
  const [content, setContent] = useState('')
  const [add, setAdd] = useState(true)
  // if(history){}
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 7,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 12,
      },
      md: {
        span: 10,
      },
    },
  };
  const submitFormLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 10,
        offset: 7,
      },
    },
  };
  const uploadImg = {
    accept: '.jpg, .jpeg, .png',
    listType: 'picture',
    fileList,
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 <= 10;
      if (!isLt10M) {
        message.error('The file size limit under 10 m！');
        return false;
      }
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        file.url = e.target.result;
        file.fileType = file.type.split('/')[1];
        setfileList([file]);
        return true;
      };
    },
    onRemove: () => {
      setfileList([]);
    },
  };
  const uploadVideo = {
    accept: 'video/*',
    fileList: videoList,
    beforeUpload: (file) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        file.contents = reader.result;
        file.fileType = file.type.split('/')[1];
        setVideoList([file]);
        return true;
      };
    },
    onRemove: () => {
      setVideoList([]);
    },
  };
  const uploadPDF = {
    accept: '.pdf',
    fileList: pdfList,
    beforeUpload: (file) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        file.contents = reader.result;
        file.fileType = file.type.split('/')[1];
        setPDFList([file]);
        return true;
      };
    },
    onRemove: () => {
      setPDFList([]);
    },
  };
  const handleModelChange = (val) => {
    form.setFieldsValue({
      fullNews: val
    })
    setContent(val);
  };
  const handleEditorChange = (val) => {
    form.setFieldsValue({
      subTitle: val
    })
    setEditorState(val);
  };

  const onFinish = (values) => {
    values.sourcePublishDateTime = moment(values.sourcePublishDateTime).format('YYYY-MM-DD HH:mm');
    values.bannerImageBase64 =
      fileList.length > 0
        ? {
          base64Data: fileList[0].url,
          fileExtension: fileList[0].fileType,
        }
        : null;
    values.videoBase64 =
      videoList.length > 0
        ? {
          base64Data: videoList[0].contents,
          fileExtension: videoList[0].fileType,
        }
        : null;
    values.pdfbase64 =
      pdfList.length > 0
        ? {
          base64Data: pdfList[0].contents,
          fileExtension: pdfList[0].fileType,
        }
        : null;
    if (add) {
      dispatch({
        type: 'newsForm/cerateNews',
        payload: values,
        callback: (res) => {
          if (res == '') {
            message.success('success');
            history.goBack();
          } else {
            message.error('error');
          }
        },
      });
    } else {
      dispatch({
        type: 'newsForm/editNews',
        payload: {
          id: params.id,
          values: values
        },
        callback: (res) => {
          if (res == '') {
            message.success('success');
            history.goBack();
          } else {
            message.error('error');
          }
        },
      });
    }

  };

  const getCategories = () => {
    dispatch({
      type: 'newsForm/getCategories',
      payload: {
        showArchived: false,
        showAuditDetails: true,
        fetchSubCategories: true,
      },
    });
  };
  const getRegions = () => {
    dispatch({
      type: 'newsForm/getRegions',
      payload: {
        showArchived: false,
        showAuditDetails: true,
      },
    });
  };
  const getStates = () => {
    dispatch({
      type: 'newsForm/getStates',
      payload: {
        showAuditDetails: true,
      },
    });
  };
  const getSources = () => {
    dispatch({
      type: 'newsForm/getSources',
      payload: {
        showArchived: false,
        showAuditDetails: true,
      },
    });
  };
  const getInfo = () => {
    dispatch({
      type: 'newsForm/getNews',
      payload: params.id,
      callback: res => {
        form.setFieldsValue({
          stateIds: res.states.map(item => item.stateId),
          sourceId: res.source.sourceId,
          regionIds: res.regions.map(item => item.regionId),
          categoryIds: res.categories.map(item => item.categoryId),
          bannerImageLink:res.bannerImage,
          videoLink:res.video,
          pdfLink:res.pdf,
          sourcePublishDateTimeStr:res.sourcePublishDateStr,
          sourcePublishDateTime:moment(res.sourcePublishDateStr,'YYYY-MM-DD HH:mm'),
          ...res
        })

        setContent(res.fullNews);
        setEditorState(res.subTitle);

      }
    });
  };

  useEffect(() => {
    if (route.path == '/edit/:id') {
      setAdd(false)
      getInfo()
    } else {
      setAdd(true)
    }
    getCategories();
    getRegions();
    getStates();
    getSources();
  }, []);

  return (
    <Spin spinning={getInfoting}>
      <Card bordered={false}>
        <Form
          style={{
            marginTop: 8,
          }}
          form={form}
          name="basic"
          onFinish={onFinish}
        >
          <FormItem
            {...formItemLayout}
            label="News Headline"
            name="headline"
            rules={[
              {
                required: true,
                message: 'please input headline'
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="News Link"
            name="link"
            rules={[
              {
                required: true,
                message: 'please input link'
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="subTitle"
            name="subTitle"
            rules={[
              {
                required: true,
                message: 'please input subtitle'
              },
            ]}
          >
            <FroalaEditorComponent model={editorState} onModelChange={handleEditorChange} config={{
              placeholder: "Edit Me",
              key: "lSA3D-17D1A1A2B1F1F1rnC-13tf1zwtxzmjvrqiqF-7axE5maqzG2B1A2C2D6B1E1C4G1F4=="
            }} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Full News"
            name="fullNews"
            rules={[
              {
                required: true,
                message: 'please input fullNews'
              },
            ]}
          >
            <FroalaEditorComponent model={content} onModelChange={handleModelChange} config={{
              placeholder: "Edit Me",
              key: "lSA3D-17D1A1A2B1F1F1rnC-13tf1zwtxzmjvrqiqF-7axE5maqzG2B1A2C2D6B1E1C4G1F4=="
            }} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Publish Date & Time"
            name="sourcePublishDateTime"
            rules={[
              {
                required: true,
                message: 'please input Publish Date & Time'
              },
            ]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="origninal time"
            name="sourcePublishDateTimeStr"
          >
            <Input readOnly={true}/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Image Link (This takes priority over Uploaded image)"
            name="bannerImageLink"
          >
            <Input />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Or Upload Image"
            name="bannerImageBase64"
          >
            <Upload {...uploadImg}>
              <Button>
                <UploadOutlined /> Upload
            </Button>
          </Upload>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Video Link (This takes priority over Uploaded Video)"
          name="videoLink"
        >
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="Or Upload Video" name="videoBase64">
          <Upload {...uploadVideo}>
            <Button>
              <UploadOutlined /> Upload
            </Button>
          </Upload>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="PDF Link (This takes priority over Uploaded PDF)"
          name="pdfLink"
        >
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="Upload PDF" name="PDFBase64">
          <Upload {...uploadPDF}>
            <Button>
              <UploadOutlined /> Upload
            </Button>
          </Upload>
        </FormItem>
        <FormItem {...formItemLayout} label="Author" name="author">
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="Description" name="description">
          <TextArea />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Category"
          name="categoryIds"
          rules={[
            {
              required: true,
              message:'please chose category'
            },
          ]}
        >
          <Select
            mode="multiple"
            maxTagCount={5}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {Categories.map((d) => (
              <Option key={d.categoryId} value={d.categoryId}>
                {d.category}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Region"
          name="regionIds"
          rules={[
            {
              required: true,
              message:'please chose category'
            },
          ]}
        >
          <Select
            mode="multiple"
            maxTagCount={5}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {Regions.map((d) => (
              <Option key={d.regionId} value={d.regionId}>
                {d.name}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem {...formItemLayout} label="State" name="stateIds" rules={[
          {
            required: true,
            message:'please chose category'
          },
        ]}>
          <Select
            mode="multiple"
            maxTagCount={5}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {States.map((d) => (
              <Option key={d.stateId} value={d.stateId}>
                {d.name}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Source"
          name="sourceId"
          rules={[
            {
              required: true,
              message:'please chose Source'
            },
          ]}
        >
          <Select
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {Sources.map((d) => (
              <Option key={d.sourceId} value={d.sourceId}>
                {d.source}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem
          {...submitFormLayout}
          style={{
            marginTop: 32,
          }}
        >
          <Button type="primary" htmlType="submit" loading={submitting}>
            {add ? 'Save' : 'Edit'}
          </Button>
          <Button
            style={{
              marginLeft: 8,
            }}
            onClick={() => history.goBack()}
          >
            Cancel
          </Button>
          </FormItem>
        </Form>
      </Card>
    </Spin>
  );
};

export default connect(({ newsForm, loading }) => ({
  newsForm,
  submitting: loading.effects['newsForm/cerateNews', 'newsForm/editNews'],
  getInfoting: loading.effects['newsForm/getNews', 'newsForm/getCategories', 'ewsForm/getRegions', 'newsForm/getStates', 'newsForm/getSources'],
}))(BasicForm);
