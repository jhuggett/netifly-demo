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
    const encodedPath = encodeURIComponent(path)
    const currentBranch = await this.getBranch()
    console.log({ currentBranch })
    let sha = currentBranch.object.sha
    const res = await this._req({
      url: `https://api.github.com/repos/${this.workingRepoFullName}/contents${path}?ref=${sha}`,
      method: 'GET',
    })
    return b64DecodeUnicode(res.content)
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
