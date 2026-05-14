import { resolve } from 'node:path'
import { getPackageInfo, isPackageExists } from 'local-pkg'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolvePackageBin } from './index'

vi.mock('local-pkg', () => ({
    isPackageExists: vi.fn(),
    getPackageInfo: vi.fn(),
}))

const mockedIsPackageExists = vi.mocked(isPackageExists)
const mockedGetPackageInfo = vi.mocked(getPackageInfo)

afterEach(() => {
    vi.clearAllMocks()
})

describe('resolvePackageBin', () => {
    it('should return empty object when package does not exist', async () => {
        mockedIsPackageExists.mockReturnValue(false)

        const result = await resolvePackageBin('non-existent-pkg')

        expect(result).toEqual({})
        expect(mockedIsPackageExists).toHaveBeenCalledWith('non-existent-pkg')
        expect(mockedGetPackageInfo).not.toHaveBeenCalled()
    })

    it('should return empty object when packageJson has no bin field', async () => {
        mockedIsPackageExists.mockReturnValue(true)
        mockedGetPackageInfo.mockResolvedValue({
            name: 'my-pkg',
            version: '1.0.0',
            rootPath: '/node_modules/my-pkg',
            packageJsonPath: '/node_modules/my-pkg/package.json',
            packageJson: { name: 'my-pkg', version: '1.0.0' },
        })

        const result = await resolvePackageBin('my-pkg')

        expect(result).toEqual({})
    })

    it('should resolve bin as string to absolute path', async () => {
        mockedIsPackageExists.mockReturnValue(true)
        mockedGetPackageInfo.mockResolvedValue({
            name: '@antfu/eslint-config',
            version: '1.0.0',
            rootPath: '/node_modules/@antfu/eslint-config',
            packageJsonPath: '/node_modules/@antfu/eslint-config/package.json',
            packageJson: {
                name: '@antfu/eslint-config',
                version: '1.0.0',
                bin: './bin/index.mjs',
            },
        })

        const result = await resolvePackageBin('@antfu/eslint-config')

        expect(result).toEqual({
            '@antfu/eslint-config': resolve('/node_modules/@antfu/eslint-config', './bin/index.mjs'),
        })
    })

    it('should resolve bin as object to absolute paths', async () => {
        mockedIsPackageExists.mockReturnValue(true)
        mockedGetPackageInfo.mockResolvedValue({
            name: 'my-tools',
            version: '1.0.0',
            rootPath: '/node_modules/my-tools',
            packageJsonPath: '/node_modules/my-tools/package.json',
            packageJson: {
                name: 'my-tools',
                version: '1.0.0',
                bin: {
                    'my-tool': 'bin/tool.js',
                    'my-helper': 'bin/helper.js',
                },
            },
        })

        const result = await resolvePackageBin('my-tools')

        expect(result).toEqual({
            'my-tool': resolve('/node_modules/my-tools', 'bin/tool.js'),
            'my-helper': resolve('/node_modules/my-tools', 'bin/helper.js'),
        })
    })
})
