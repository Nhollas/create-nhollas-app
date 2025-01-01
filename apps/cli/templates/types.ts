import { PackageManager } from "../helpers/get-pkg-manager"

export type TemplateType = "default"

export interface GetTemplateFileArgs {
  template: TemplateType
  file: string
}

export interface InstallTemplateArgs {
  root: string
  isOnline: boolean
}
