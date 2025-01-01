export type TemplateType = "default"

export interface GetTemplateFileArgs {
  template: TemplateType
  file: string
}

export interface InstallTemplateArgs {
  root: string
  isOnline: boolean
}
