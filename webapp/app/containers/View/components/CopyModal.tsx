import React from 'react'
import { Modal, Form, Button, Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { IViewBase } from '../types'
const FormItem = Form.Item

interface ICopyModalProps extends FormComponentProps<IViewBase> {
  visible: boolean
  fromView: IViewBase
  onCheckUniqueName: (viewName: string, resolve: () => void, reject: (err: string) => void) => void
  onCopy: (view: IViewBase) => void
  onCancel: () => void
}

export class CopyModal extends React.PureComponent<ICopyModalProps> {
  private formItemStyle = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  private save = () => {
    const { form, fromView, onCopy } = this.props
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) { return }
      const copyView: IViewBase = { ...fieldsValue, id: fromView.id }
      onCopy(copyView)
    })
  }

  private checkName = (_, value, callback) => {
    const { onCheckUniqueName } = this.props
    onCheckUniqueName(value, () => {
      callback()
    }, (err) => {
      callback(err)
    })
  }

  private modalButtons = [(
    <Button
      key="back"
      size="large"
      onClick={this.props.onCancel}
    >
      取 消
    </Button>
  ), (
    <Button
      key="submit"
      size="large"
      type="primary"
      onClick={this.save}
    >
      保 存
    </Button>
  )]

  private clearFieldsValue = () => {
    this.props.form.resetFields()
  }

  public render () {
    const { form, visible, fromView, onCancel } = this.props
    const { getFieldDecorator } = form
    if (!fromView) { return null }

    return (
      <Modal
        title="复制 View"
        wrapClassName="ant-modal-small"
        visible={visible}
        footer={this.modalButtons}
        onCancel={onCancel}
        afterClose={this.clearFieldsValue}
      >
        <Form>
          <FormItem label="新名称" {...this.formItemStyle}>
            {getFieldDecorator<IViewBase>('name', {
              validateFirst: true,
              rules: [
                { required: true, message: '不能为空' },
                { validator: this.checkName }
              ],
              initialValue: fromView.name
            })(<Input />)}
          </FormItem>
          <FormItem label="描述" {...this.formItemStyle}>
            {getFieldDecorator<IViewBase>('description', {
              initialValue: fromView.description
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create<ICopyModalProps>()(CopyModal)
