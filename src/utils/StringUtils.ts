class StringUtils {
  public static STRING_TO_HTML = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body;
  };
}

export default StringUtils;
