import { formatUnits } from "ethers/lib/utils.js";

export const growShrinkProps = {
  _hover: {
    transform: 'scale(1.025)'
  },
  _active: {
    transform: 'scale(0.95)'
  },
  transition: '0.125s ease'
};

export const pinchString = (
  s: string,
  n: number | [number, number]
): string => {
  if (Array.isArray(n)) {
    return `${s.slice(0, n[0])}...${s.slice(s.length - n[1])}`;
  }
  return `${s.slice(0, n)}...${s.slice(s.length - n)}`;
};

const decimalNumber = new RegExp(
  `(^[0-9]{1,60}.[0-9]{1,18}$|^[.]{1}[0-9]{1,18}$|^[0-9]{1,60}[.]{1}$)`
);
export const isDecimalNumber = (n: string): Boolean => {
  if (!n) return false;
  return decimalNumber.test(n);
};

export const uriToHttp = (uri: string) => {
  const protocol = uri.split(':')[0].toLowerCase();
  const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
  const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
  switch (protocol) {
    case 'https':
      return [uri];
    case 'http':
      return [`https${uri.substr(4)}`, uri];
    case 'ipfs':
      return [
        `https://cloudflare-ipfs.com/ipfs/${hash}/`,
        `https://ipfs.io/ipfs/${hash}/`,
      ];
    case 'ipns':
      return [
        `https://cloudflare-ipfs.com/ipns/${name}/`,
        `https://ipfs.io/ipns/${name}/`,
      ];
    default:
      return [];
  }
};

export const formatValue = (num: bigint, dec: number) => {
  const str = formatUnits(num, dec);
  const splitStr = str.split('.');
  const beforeDecimal = splitStr[0];
  const afterDecimal = `${(splitStr[1] ?? '').slice(0, 4)}0000`;

  const finalNum = Number(`${beforeDecimal}.${afterDecimal}`);

  return finalNum.toLocaleString('en-US', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 1,
  });
};

export const truncateText = (text: string, maxLength: number) => {
  let truncated = text;

  if (truncated.length > maxLength - 3) {
    truncated = `${truncated.substr(0, maxLength - 3)}...`;
  }
  return truncated;
};

const downloadFile = ({ data, fileName, fileType }:
  { data: string; fileName: string; fileType: string }) => {
  const blob = new Blob([data], { type: fileType })
  const a = document.createElement('a')
  a.download = fileName
  a.href = window.URL.createObjectURL(blob)
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  a.dispatchEvent(clickEvt)
  a.remove()
}

export const exportToJson = (e: any, data: any) => {
  e.preventDefault()
  downloadFile({
    data: JSON.stringify(data),
    fileName: `privacy-pools-${data.withdrawalProof.nullifier}.json`,
    fileType: 'text/json',
  })
}
