import { useUserStore } from '../store'
import { UserInfo } from '../user_info';


/**
 * Uvicore Auth Adapter Base Class
 */
export class BaseAuth {
  public config: any;

  /**
   * Instantiate new class
   * @param config
   */
  public constructor(config: any) {
    this.config = config;
  }

  /**
   * Pinia UserInfo store
   */
   public get userStore() {
    return useUserStore();
  }

  /**
   * Get storage, either local or session based on auth config
   */
   public get storage(): Storage {
    return (window[this.config.storage] as unknown) as Storage;
  }

  /**
   * Get storage key for main auth userinfo object (based on config)
   */
  public get storageKey(): string {
    return this.config.storageKey;
  }

  /**
   * Get user info from storage
   * @returns UserInfo|null
   */
   public getStorage(): UserInfo|null {
    if (this.hasStorage()) {
      let value: any = this.storage.getItem(this.storageKey);
      if (value) {
        value = JSON.parse(value)
        return new UserInfo(value)
      }
    }
    return null;
  }

  /**
   * Check if user info is in storage
   * @returns boolean
   */
   public hasStorage(): boolean {
    if (this.storage.getItem(this.storageKey) === null) return false;
    return true;
  }

  /**
   * Set user info into storage
   */
   public setStorage(userInfo: UserInfo): void {
    this.storage.setItem(this.storageKey, JSON.stringify(userInfo));
  }

  /**
   * Remove user info from storage
   */
  public removeStorage(): void {
    this.storage.removeItem(this.storageKey);
  }

}
