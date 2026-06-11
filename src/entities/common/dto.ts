export interface Response<T> {
  code: number
  data: T
  msg?: string
  error?: string
}
