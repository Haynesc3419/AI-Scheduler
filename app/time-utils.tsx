
export const militaryToStandard = (time: string) => {
    const spl  = time.split(":")
    var hour = parseInt(spl[0])
    const minute = spl[1]
    var modifier = 'AM'

    if (hour > 12) {
        hour = hour - 12
        modifier = 'PM'
    } else if (hour == 12) {
        modifier = 'PM'
    }

    const result = hour.toString() + ':' + minute + ' ' + modifier
    return result;
}