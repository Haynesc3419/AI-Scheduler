
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

export const calculateDuration = (time1: string, time2: string) => {
    return parseInt(time2.split(":")[0]) - parseInt(time1.split(":")[0]);
}

// compares time using hour field
export const compareTime = (time1: string, time2: string) => {
    return parseInt(time1.replace(":", "")) - parseInt(time2.replace(":", ""))
}