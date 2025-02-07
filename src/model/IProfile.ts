export interface IProfile {
  id?: number
  name: string
  type: 'local' | 'aihub_build'
  default: boolean
  background: {
    color: string
    image: string
  }
  uploadCard: {
    title: string
    titleColor: string
    logoUrl: string
    backgroundColor: string
    submitButtonColor: string
  }
  aihub: {
    apiRoot: string,
    apiKey: string,
    userId: string,
    organizationId: string,
    context: string,
    workspace: string,
    driveName: string,
    appId: string,
    appName: string,
  }
}

export const newProfile: IProfile = {
  background: { color: '#32A980', image: '' },
  default: false,
  type: 'local',
  name: '',
  uploadCard: {
    backgroundColor: '#ffffff',
    submitButtonColor: '#8361AB',
    title: 'Document Upload',
    titleColor: '#000000',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Instabase_Logo_2019.png',
  },
  aihub: {
    apiRoot: 'https://aihub.instabase.com/api',
    apiKey: '', // 'YOUR_API_KEY_HERE',
    userId: '', // 'YOUR_USER_ID_HERE',
    organizationId: '', // 'YOUR_ORGANIZATION_ID_HERE (Only for AIHub Commercial)',
    context: '', // 'USER_ID or ORGANIZATION_ID (Only for AIHub Commercial)',
    workspace: '', // 'YOUR_WORKSPACE_HERE (Only for AIHub Commercial)',
    driveName: 'Instabase Drive',
    appId: '',
    appName: '',
  },
}
