import { IProfile, newProfile } from '@src/model/IProfile'

export class ProfileManager {
  static readonly localStorageKey = 'ib-profiles'

  constructor(
    private state: IProfile[],
    private setState: (setProfiles: IProfile[]) => void,
  ) {
  }

  getProfiles(): IProfile[] {
    return this.state
  }

  addProfile(toAddProfile: IProfile): void {
    toAddProfile.id = Math.floor(Date.now() / 1000)
    this.getProfiles().push(toAddProfile)
    localStorage.setItem(
      ProfileManager.localStorageKey,
      JSON.stringify(this.getProfiles()),
    )
    this.setState([...this.getProfiles()])
  }

  removeProfile(profileId: number): void {
    const updatedProfiles = this.getProfiles().filter(
      (profile) => profile.id !== profileId,
    )
    this.setState(updatedProfiles)
    localStorage.setItem(
      ProfileManager.localStorageKey,
      JSON.stringify(updatedProfiles),
    )
  }

  updateProfile(update: IProfile): void {
    const updatedProfiles = this.getProfiles().map((profile) => {
      if (profile.id === update.id) {
        return { ...profile, ...update }
      }
      return profile
    })
    this.setState(updatedProfiles)
    localStorage.setItem(
      ProfileManager.localStorageKey,
      JSON.stringify(updatedProfiles),
    )
  }

  getProfile(profileId: number): IProfile {
    const profile = this.state.find((p) => p.id === profileId)
    if (!profile) throw new Error('IProfile not found')

    return profile
  }

  setDefault(profileId: number): void {
    const updatedProfiles = this.state.map((profile) => ({
      ...profile,
      default: profile.id === profileId,
    }))
    this.setState(updatedProfiles)
    localStorage.setItem('ib-profiles', JSON.stringify(updatedProfiles))
  }

  getDefault(): IProfile {
    const profile = this.state.find((p) => p.default === true)
    if (profile) return { ...newProfile, ...profile }
    return newProfile
  }

  getApiRoot(): string {
    return this.getDefault().aihub.apiRoot
  }

  getTokenHeader(): { Authorization: string, 'IB-Context': string } {
    return {
      Authorization: `Bearer ${this.getDefault().aihub.apiKey}`,
      'IB-Context': this.getDefault().aihub.context,
    }
  }
}
