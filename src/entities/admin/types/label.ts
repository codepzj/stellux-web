export type LabelType = 'category' | 'tag'

export interface LabelVO {
  id: string
  label_type: string
  name: string
}

export interface CreateLabelReq {
  label_type: string
  name: string
}

export interface EditLabelReq extends CreateLabelReq {
  id: string
}

export interface LabelPageReq {
  page_no: number
  page_size: number
  label_type: string
  keyword?: string
}
