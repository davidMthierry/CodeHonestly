import { Component, ViewChildren, QueryList, ElementRef, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'code-input',
  templateUrl: './code-input.component.html',
  styleUrls: ['./code-input.component.sass']
})
export class CodeInputComponent implements AfterViewInit {
  @ViewChildren('codeView') codeViews: QueryList<ElementRef>

  examples = [
`import pandas as pd
import matplotlib.pyplot as plt

def clean_data(data):
    data = data.drop_duplicates()
    data.fillna(0,inplace=True)
    data = data[data['catagory']=='other'].copy()
    return data

def explore_data(data):
    print(data.info())
    print("average price: "+str(data['price'].mean()))
    print("max price: "+str(data['price'].max()))
    print("quantity: "+str(len(data)))

def train_model(data):
    data = clean_data(data)
    x = data.drop(['price'])
    y = data['price']
    model = LogisticRegression()
    model.train_n_folds(x,y,fold = 5)
    return model

def validate_model(test_data,model):
    test_data = clean_data(test_data)
    x = test_data.drop(['price'])
    y = test_data['price']
    predicted = model.predict(x)
    accuracy = (predicted == y).mean()
    return accuracy
`,
`import pandas as pd
def find_mean_by_group(df, col):
  return df.groupby(col).mean()

test = pd.DataFrame([[1, 2, 3], [4, 5, 6], [7, 8, 9]], columns=['a', 'b', 'c'])
find_mean_by_group(test, a)
`
  ]

  code: string[] = [`# demonstration of preprocessing and normalizing imports
import pandas as pd
a = pd.DataFrame()

# demonstration of normalization of chained calls
pd.DataFrame([[1, 2, 3], [4, 5, 6]]).sum().mean()

# demonstration of UDF, UDV, built-in/package methods differentiation
def c(d):
  return d + 1
# e.g. we called b = function_returner()
b()
c()
sum(1, 2, 3)`, '']

  @Input() visualizeMode: boolean = true

  @Output() codeChange: EventEmitter<string[]> = new EventEmitter<string[]>()
  @Output() mode: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() visualizeClick: EventEmitter<string> = new EventEmitter<string>()
  @Output() reportClick: EventEmitter<string[]> = new EventEmitter<string[]>()

  @Input() imports: Map<string, string> = new Map<string, string>()

  ngAfterViewInit() {
    this.visualizeClick.emit(this.code[0])
  }

  processTab(e: KeyboardEvent, index=0): boolean {
    let asArray: Array<ElementRef> = this.codeViews.toArray()
    if (e.key === 'Tab') {
      let start: number = asArray[index].nativeElement.selectionStart, end: number = asArray[index].nativeElement.selectionEnd
      this.code[index] = this.code[index].substring(0, start) + '\t' + this.code[index].substring(end)
      setTimeout(function(): void {
        asArray[index].nativeElement.selectionStart = asArray[index].nativeElement.selectionEnd = start + 1
      }.bind(this), 0)
      return false
    }
  }

  handleExample(e: MatSelectChange, index=0):void {
    this.code[index] = e.value
  }

  toggleVisualization(): void {
    this.visualizeMode = !this.visualizeMode
    this.mode.emit(this.visualizeMode)
    this.visualizeClick.emit(this.code[0])
  }

  processFile(e: any, index=0): void {
    let fr: FileReader = new FileReader()
    fr.onload = () => {
      this.codeViews.toArray()[index].nativeElement.value = fr.result
      this.code[index] = fr.result as string
    }
    fr.readAsText(e.target.files[0])
  }
}
