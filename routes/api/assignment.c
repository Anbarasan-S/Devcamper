#include<stdio.h>
long long int add_sub(long long int num,int option)
{
  long long int value1,value2;
   if(num%2==1)
   {
       value1=(num+1)/2;
       value2=(num-1)+value1;
   }
   else
    {
        value1=num/2;
        value2=num+value1;
    }
    
    if(option==1)
        return value1;
    else if(option==2)
        return value2;
}
int main()
{
    long long int num;
    int option,value1,value2;
    printf("Enter the number: \n");
    scanf("%lld",&num);
    printf("Enter the option 1 or 2: ");
    scanf("%d",&option);
    printf("%lld",add_sub(num,option));
    return 0;
}
