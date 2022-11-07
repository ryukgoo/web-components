// eslint-disable-next-line import/no-extraneous-dependencies
import { Mutex } from 'async-mutex';

class DynamicLoadUtils {
  private static mutex = new Mutex();

  /**
   * "sync" load dynamic script element with lock
   * 동적 스크립트 로드 완료(+ (async)func)까지 lock를 걸어 script의 중복생성을 방지함.
   * @param id
   * @param url
   * @param func
   * @return Promise
   */
  public static async syncLoadScript(
    id: string,
    url: string,
    func?: () => Promise<void>
  ): Promise<void> {
    await this.mutex.runExclusive(async () => {
      await DynamicLoadUtils.loadScript(id, url);
      if (func !== undefined) await func();
    });
  }

  /**
   * "async" load dynamic script element
   * @param id
   * @param url
   * @return Promise
   */
  public static loadScript(id: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let script = document.getElementById(id) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script') as HTMLScriptElement;
        script.src = url;
        script.id = id;
        script.onerror = e => {
          console.log('loadScript', e);
          reject();
        };
        script.onload = () => resolve();
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  }
}

export default DynamicLoadUtils;
