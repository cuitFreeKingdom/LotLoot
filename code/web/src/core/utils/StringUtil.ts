export class StringUtil {
  static isEmpty(str: string | null | undefined) {
    return !str || str === "";
  }

  static xor(str: string, key: string): string {
    let res = "";
    for (let i = 0; i < str.length; i++) {
      res += String.fromCharCode(
        str.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return res;
  }

  static getAddressSnapshot(str: string) {
    if (str.length <= 16) {
      return str;
    }
    return str.substring(0, 16) + '......';
  }
}
