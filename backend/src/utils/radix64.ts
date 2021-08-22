const rixits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'

export function radix64(uuidStr: string): string {
  let hexRepr: string = uuidStr.replace(/-/g, '')
  let expd64Repr: Array<number> = []

  for (let i=0;i<hexRepr.length;i++) {
    switch (i%3) {
      case 0:
        expd64Repr.push(parseInt(hexRepr[0], 16) << 2)
        break
      case 1:
        expd64Repr[expd64Repr.length-1] += (parseInt(hexRepr[i], 16) & 0xC) >> 2
        expd64Repr.push((parseInt(hexRepr[i], 16) & 0x3) << 4)
        break
      case 2:
        expd64Repr[expd64Repr.length-1] += parseInt(hexRepr[i], 16)
        break
    }
  }
  return expd64Repr.map((c) => {return rixits[c]}).join('')
}