import { GithubClient as OldGithubClient } from 'react-tinacms-github'

export class GithubClient extends OldGithubClient {
  private async _req(data: any) {
    const response = await this._proxyRequest(data)
    return this._getGithubResponse(response)
  }

  private _proxyRequest(data: any) {
    return fetch(this.proxy, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  private async _getGithubResponse(response: Response) {
    const data = await response.json()
    //2xx status codes
    if (response.status.toString()[0] == '2') return data

    throw new GithubError(response.statusText, response.status)
  }

  async getFile(path: string) {
    const currentBranch = await this.getBranch()
    let sha = currentBranch.object.sha
    const res = await this._req({
      url: `https://api.github.com/repos/${this.workingRepoFullName}/contents${path}?ref=${sha}`,
      method: 'GET',
    })
    return {
      content: b64DecodeUnicode(res.content),
      sha: res.sha,
    }
  }

  async getMediaUri(path: string) {
    const currentBranch = await this.getBranch()
    let sha = currentBranch.object.sha
    let res
    res = await this._req({
      url: `https://api.github.com/repos/${this.workingRepoFullName}/contents${path}?ref=${sha}`,
      method: 'GET',
    })

    return res.download_url
  }

  async upload(
    path: string,
    fileContents: string,
    commitMessage: string = 'Update from TinaCMS',
    encoded: boolean = false
  ) {
    const repo = this.workingRepoFullName
    const branch = this.branchName
    const currentBranch = await this.getBranch()
    let sha = currentBranch.object.sha

    return this._req({
      url: `https://api.github.com/repos/${repo}/contents/${path}`,
      method: 'PUT',
      data: {
        message: commitMessage,
        sha,
        content: encoded ? fileContents : b64EncodeUnicode(fileContents),
        branch: branch,
      },
    })
  }
}

class GithubError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.message = message
    this.status = status
  }
}

const atob = require('atob')

const b64DecodeUnicode = (str: string) => {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(function (c: string) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
}

const b64EncodeUnicode = (str: string) => {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(
      _match,
      p1
    ) {
      return String.fromCharCode(parseInt(p1, 16))
    })
  )
}
