import type { PageReq, PageResponse, Response } from '@/types/admin/dto'
import type {
  DocumentContentEditRequest,
  DocumentContentRequest,
  DocumentContentVO,
  DocumentRootEditRequest,
  DocumentRootRequest,
  DocumentRootVO,
  DocumentTreeVO,
} from '@/types/admin/document'
import type { FriendCreateReq, FriendListReq, FriendUpdateReq, FriendVO } from '@/types/admin/friend'
import type { CreateLabelReq, EditLabelReq, LabelPageReq, LabelVO } from '@/types/admin/label'
import type { PostDetailVO, PostListType, PostReq, PostVO } from '@/types/admin/post'
import type {
  CreateUserReq,
  LoginReq,
  LoginVO,
  UpdatePasswordReq,
  UpdateUserReq,
  UserInfoVO,
} from '@/types/admin/user'

export type AdminClient = <T>(
  path: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    params?: object
    body?: unknown
  }
) => Promise<Response<T>>

export const userLoginAPI = (client: AdminClient, data: LoginReq) =>
  client<LoginVO>('/user/login', { method: 'POST', body: data })

export const getUserInfoAPI = (client: AdminClient) => client<UserInfoVO>('/admin/user/info')

export const updateUserPasswordAPI = (client: AdminClient, data: UpdatePasswordReq) =>
  client<UserInfoVO>('/admin/user/update-password', { method: 'PUT', body: data })

export const getUserListAPI = (client: AdminClient, params: PageReq) =>
  client<PageResponse<UserInfoVO>['data']>('/admin/user/list', { params })

export const createUserAPI = (client: AdminClient, data: CreateUserReq) =>
  client<UserInfoVO>('/admin/user/create', { method: 'POST', body: data })

export const updateUserAPI = (client: AdminClient, data: UpdateUserReq) =>
  client<UserInfoVO>('/admin/user/update', { method: 'PUT', body: data })

export const deleteUserAPI = (client: AdminClient, id: string) =>
  client<UserInfoVO>(`/admin/user/delete/${id}`, { method: 'DELETE' })

export const queryLabelListAPI = (client: AdminClient, params: LabelPageReq) =>
  client<PageResponse<LabelVO>['data']>('/label/list', { params })

export const queryAllByTypeAPI = (client: AdminClient, label_type: string) =>
  client<LabelVO[]>('/label/all', { params: { label_type } })

export const createLabelAPI = (client: AdminClient, data: CreateLabelReq) =>
  client<null>('/admin/label/create', { method: 'POST', body: data })

export const editLabelAPI = (client: AdminClient, data: EditLabelReq) =>
  client<null>('/admin/label/edit', { method: 'PUT', body: data })

export const deleteLabelAPI = (client: AdminClient, id: string) =>
  client<null>(`/admin/label/delete/${id}`, { method: 'DELETE' })

export const createPostAPI = (client: AdminClient, data: PostReq) =>
  client<null>('/admin/post/create', { method: 'POST', body: data })

export const updatePostAPI = (client: AdminClient, data: PostReq) =>
  client<null>('/admin/post/update', { method: 'PUT', body: data })

export const updatePostPublishStatusAPI = (
  client: AdminClient,
  id: string,
  is_publish: boolean
) =>
  client<null>('/admin/post/update/publish-status', {
    method: 'PUT',
    body: { id, is_publish },
  })

export const getPostByIdAPI = (client: AdminClient, id: string) => client<PostVO>(`/post/${id}`)

export const getPostDetailByIdAPI = (client: AdminClient, id: string) =>
  client<PostDetailVO>(`/post/detail/${id}`)

export const getPostListAPI = (client: AdminClient, type: PostListType, params: PageReq) => {
  const endpoint =
    type === 'draft'
      ? '/admin/post/draft/list'
      : type === 'bin'
        ? '/admin/post/bin/list'
        : '/post/list'

  return client<PageResponse<PostDetailVO>['data']>(endpoint, { params })
}

export const restorePostAPI = (client: AdminClient, id: string) =>
  client<null>(`/admin/post/restore/${id}`, { method: 'PUT' })

export const restorePostBatchAPI = (client: AdminClient, id_list: string[]) =>
  client<null>('/admin/post/restore/batch', { method: 'PUT', body: { id_list } })

export const softDeletePostAPI = (client: AdminClient, id: string) =>
  client<null>(`/admin/post/soft-delete/${id}`, { method: 'DELETE' })

export const softDeletePostBatchAPI = (client: AdminClient, id_list: string[]) =>
  client<null>('/admin/post/soft-delete/batch', { method: 'DELETE', body: { id_list } })

export const deletePostAPI = (client: AdminClient, id: string) =>
  client<null>(`/admin/post/delete/${id}`, { method: 'DELETE' })

export const deletePostBatchAPI = (client: AdminClient, id_list: string[]) =>
  client<null>('/admin/post/delete/batch', { method: 'DELETE', body: { id_list } })

export const createFriendAPI = (client: AdminClient, data: FriendCreateReq) =>
  client<null>('/admin/friend/create', { method: 'POST', body: data })

export const getFriendListAPI = (client: AdminClient, data: FriendListReq) =>
  client<PageResponse<FriendVO>['data']>('/admin/friend/list', { method: 'POST', body: data })

export const updateFriendAPI = (client: AdminClient, data: FriendUpdateReq) =>
  client<null>('/admin/friend/update', { method: 'PUT', body: data })

export const deleteFriendAPI = (client: AdminClient, id: string) =>
  client<null>(`/admin/friend/delete/${id}`, { method: 'DELETE' })

export const createRootDocumentAPI = (client: AdminClient, data: DocumentRootRequest) =>
  client<null>('/admin/document/create', { method: 'POST', body: data })

export const updateRootDocumentAPI = (client: AdminClient, data: DocumentRootEditRequest) =>
  client<null>('/admin/document/update', { method: 'PUT', body: data })

export const deleteRootDocumentAPI = (client: AdminClient, id: string) =>
  client<null>(`/admin/document/delete/${id}`, { method: 'DELETE' })

export const softDeleteRootDocumentAPI = (client: AdminClient, id: string) =>
  client<null>(`/admin/document/soft-delete/${id}`, { method: 'PUT' })

export const restoreRootDocumentAPI = (client: AdminClient, id: string) =>
  client<null>(`/admin/document/restore/${id}`, { method: 'PUT' })

export const getRootDocumentListAPI = (client: AdminClient, params: PageReq) =>
  client<PageResponse<DocumentRootVO>['data'] | DocumentRootVO[]>('/admin/document/list', { params })

export const getDocumentBinListAPI = (client: AdminClient, params: PageReq) =>
  client<PageResponse<DocumentRootVO>['data']>('/admin/document/bin-list', { params })

export const getDocumentContentBinListAPI = (client: AdminClient, params: PageReq) =>
  client<PageResponse<DocumentContentVO>['data']>('/admin/document-content/bin-list', { params })

export const createDocumentContentAPI = (client: AdminClient, data: DocumentContentRequest) =>
  client<null>('/admin/document-content/create', { method: 'POST', body: data })

export const getDocumentContentAPI = (client: AdminClient, id: string) =>
  client<DocumentContentVO>(`/admin/document-content/${id}`)

export const updateDocumentContentAPI = (client: AdminClient, data: DocumentContentEditRequest) =>
  client<null>('/admin/document-content/update', { method: 'PUT', body: data })

export const deleteDocumentContentAPI = (client: AdminClient, id: string) =>
  client<null>(`/admin/document-content/${id}`, { method: 'DELETE' })

export const softDeleteDocumentContentAPI = (client: AdminClient, id: string) =>
  client<null>(`/admin/document-content/soft-delete/${id}`, { method: 'PUT' })

export const restoreDocumentContentAPI = (client: AdminClient, id: string) =>
  client<null>(`/admin/document-content/restore/${id}`, { method: 'PUT' })

export const getDocumentContentByDocumentIdAPI = (client: AdminClient, documentId: string) =>
  client<DocumentContentVO[]>('/admin/document-content/all', { params: { document_id: documentId } })

export const getDocumentTreeDataAPI = (client: AdminClient, documentId: string) =>
  client<DocumentTreeVO[]>('/admin/document-content/all', { params: { document_id: documentId } })
