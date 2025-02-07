import axios from 'axios'
import { ProfileManager } from './ProfileManager'

export default class Api {
  private endpoints: {
    [key: string]: (() => string) | ((arg1: string) => string) | ((arg1: string, arg2: string) => string) | ((arg1: number) => string)
  } = {
      create_batch: () => `${this.profileManager.getApiRoot()}/v2/batches`,
      upload_file: (batchId: number) => `${this.profileManager.getApiRoot()}/v2/batches/${batchId}/files`,
      app_run_by_id: (appId: string) => `${this.profileManager.getApiRoot()}/v2/apps/runs/${appId}`,
      app_run: () => `${this.profileManager.getApiRoot()}/v2/apps/runs`,
      app_get_job_status: (jobId: string) => `${this.profileManager.getApiRoot()}/v2/apps/runs/${jobId}`,
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

  // Domain specific API Call.
  public async upload_file(file: File, folder: string = '') {
    const {
      organizationId,
      workspace,
      driveName,
    } = this.profileManager.getDefault().aihub;
    
    const path = `${organizationId}/${workspace ?? 'my-repo'}/fs/${driveName}/uploadPortal/${folder}/${file.name}`;

    return this.put('upload_file', (await readFileAsync(file)), batchId);
  }

  // Function to create a batch
  public async createBatch(batchName: string) {
    const response = await fetch(this.endpoints.create_batch(), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${await this.profileManager.getApiKey()}`,
            'IB-Context': this.profileManager.getIbContext(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: batchName })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error creating batch: ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return { isError: false, data };
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

  public async add_file_to_batch(batchId: number, file: File) {
    const myHeaders = {
        'Authorization': `Bearer ${await this.profileManager.getApiKey()}`,
        'IB-Context': this.profileManager.getIbContext(),
        'Content-Type': 'application/octet-stream' // Assuming you're uploading binary files
    };

    const response = await fetch(`${this.endpoints.upload_file(batchId)}/${file.name}`, {
        method: 'PUT', // Use PUT to upload files
        headers: myHeaders,
        body: file // Directly send the file as the body
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error uploading file: ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return { isError: false, data };
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
