import type { PackageInfo } from 'local-pkg'
import { resolve } from 'node:path'
import { getPackageInfo, isPackageExists } from 'local-pkg'

export type PackageBin = Record<string, string>

export interface IOptions {
    paths?: string[]
}

export const resolvePackageBin = async (pkg: string, options: IOptions = {}): Promise<PackageBin> => {
    const paths = options.paths ?? []

    if (!isPackageExists(pkg, { paths })) {
        return {}
    }

    const info = await getPackageInfo(pkg, { paths }) as PackageInfo

    const { bin } = info.packageJson
    if (!bin)
        return {}

    if (typeof bin === 'string') {
        return {
            [info.name]: resolve(info.rootPath, bin),
        }
    }

    return Object.fromEntries(
        Object.entries(bin).map(([name, path]) => [name, resolve(info.rootPath, path)]),
    )
}
