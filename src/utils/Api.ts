import axios from 'axios'
import { ProfileManager } from './ProfileManager'

export default class Api {
  private endpoints: {
    [key: string]: (() => string) | ((arg1: string) => string) | ((
      arg1: string, arg2: string) => string)
  } = {
      upload_file: (path: string) => `${this.profileManager.getApiRoot()}/v2/batches`,
      app_run_by_id: (appId: string) => `${this.profileManager.getApiRoot()}/v2/apps/runs`,
      app_run: () => `${this.profileManager.getApiRoot()}/v2/apps/runs`,
      app_get_job_status: (jobId: string) => `${this.profileManager.getApiRoot()}/v2/apps/runs`,
      app_get_results: () => `${this.profileManager.getApiRoot()}/v2/apps/runs`,
      converse_get_conversations: () => `${this.profileManager.getApiRoot()}/v2/aihub/converse/conversations`,
      converse_post_conversations: () => `${this.profileManager.getApiRoot()}/v2/aihub/converse/conversations`,
      converse_get_conversation: (conversationId: string) => `${this.profileManager.getApiRoot()}/v2/aihub/converse/conversations/${conversationId}`,
      converse_prompt_conversation: (conversationId: string) => `${this.profileManager.getApiRoot()}/v2/aihub/converse/conversations/${conversationId}/prompts`,
    }

  constructor(private profileManager: ProfileManager) {
  }

  public get(name: string, ...params: Array<string | number>) {
    return this.request('GET', name, params)
  }

  public post(name: string, body: object = {}, ...params: Array<string | number>) {
    return this.request('POST', name, params, body)
  }

  public put(
    name: string,
    body: object | string = {},
    ...params: Array<string | number>
  ) {
    return this.request('PUT', name, params, body)
  }

  public patch(name: string, body: object = {}, ...params: Array<string | number>) {
    return this.request('PATCH', name, params, body)
  }

  public async request(
    method: HttpMethod,
    name: string,
    params: Array<string | number>,
    body: object | string = {},
    headers: object = {},
    axiosParams: object = {},
  ): Promise<IApiResponse<any>> {
    let contentType = 'application/json'
    if (body && body instanceof FormData) contentType = 'multipart/form-data'
    if (body && body
      instanceof ArrayBuffer) contentType = 'application/octet-stream'
    if (body && typeof body === 'string') contentType = 'text/plain'

    return axios({
      // @ts-ignore
      url: this.endpoints[name](...params),
      method,
      headers: {
        'Content-Type': contentType,
        Accept: 'application/json',
        ...(await this.profileManager.getTokenHeader()),
        ...headers,
      },
      ...axiosParams,
      data: body,
    }).then((response) => {
      if (
        !response.data
        || response.data[name] === 'undefined'
        || response.data[name.split('_')[0]] === 'undefined'
      ) {
        return { isError: false, data: response.data }
      }

      if (response.data[name] && Object.keys(response.data).length === 1) {
        return { isError: false, data: response.data[name] }
      }

      if (response.data[name.split('_')[0]]
        && Object.keys(response.data).length === 1) {
        return { isError: false, data: response.data[name.split('_')[0]] }
      }

      return { isError: false, data: response.data }
    }).catch((error) => ({
      isError: true,
      data: error.response && error.response.data ? error.response.data : error,
      error,
    }))
  }

  // Domain specific API Call
  public async createBatch(workspace: string) {
    const myHeaders = {
      'IB-Context': 'ib-internal',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await this.profileManager.getApiKey()}`, // Assuming you have a method to get the API key
    };

    const body = JSON.stringify({
      workspace: workspace,
    });

    try {
      const response = await axios.post(`${this.profileManager.getApiRoot()}/v2/batches`, body, { headers: myHeaders });
      return { isError: false, data: response.data };
    } catch (error) {
      return {
        isError: true,
        data: error.response && error.response.data ? error.response.data : error,
        error,
      };
    }
  }

  public async uploadFile(batchId: string, file: File) {
    const myHeaders = {
      'IB-Context': 'ib-internal',
      'Content-Type': 'application/octet-stream',
      'Authorization': `Bearer ${await this.profileManager.getApiKey()}`, // Assuming you have a method to get the API key
    };

    const fileData = await readFileAsync(file); // Assuming readFileAsync is defined to read the file

    try {
      const response = await axios.put(`${this.profileManager.getApiRoot()}/v2/batches/${batchId}/files/${file.name}`, fileData, { headers: myHeaders });
      return { isError: false, data: response.data };
    } catch (error) {
      return {
        isError: true,
        data: error.response && error.response.data ? error.response.data : error,
        error,
      };
    }
  }

  public async appRun(folder: string) {
    const {
      organizationId,
      workspace,
      driveName,
      appId,
      appName,
    } = this.profileManager.getDefault().aihub
    const inputDir = `${organizationId}/${workspace
    ?? 'my-repo'}/fs/${driveName}/uploadPortal/${folder}/`

    if (appName?.length === 0 && appId?.length === 0) {
      throw new Error(
        'Either an app id or name should be provided. None are currently.',
      )
    }

    if (appId?.length > 1) {
      return this.post(
        'app_run_by_id',
        { input_dir: inputDir },
        appId,
      )
    }

    return this.post('app_run', { input_dir: inputDir, name: appName })
  }
}

function readFileAsync(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as ArrayBuffer.'))
      }
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsArrayBuffer(file)
  })
}

export interface IApiResponse<T> {
  isError: boolean
  data: string | T
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH';
