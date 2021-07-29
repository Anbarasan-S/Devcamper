const list=["type",6,27,3.00,"dhoni",344,"kohli",18.9999999999];
const float=[];
const int=[];
const string=[];
list.map(item=>{
            if(typeof(item)==='number')
            {
                if(item%1===0)
                {
                  int.push(item);
                }
                else
                {
                
                   float.push(item);
                }
            }
            else
            {
             string.push(item);
            }
});
console.log(11.00*1.00);
console.log(float);
console.log(string);
