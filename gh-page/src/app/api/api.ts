import { Result } from '../output-results/output-results.component'

export class APIs {
  static async getReport(code: string[], password?: string): Promise<Result> {
    let body: string = ''
    for (let [index, element] of code.entries()) {
      body += `input${index + 1}=${encodeURIComponent(element)}&`
    }

    let req = await fetch('http://demo.codehonestly.com:5000/simreport', {
      method: 'POST', headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: password === undefined ? body.slice(0, -1) : body + `password=${password}`
    })
    let response = await req.json()
    if (response.hasOwnProperty('error')) {
      throw new Error(response.error)
    }

    return response
  }
}
