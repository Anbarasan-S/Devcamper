#include<iostream>
using namespace std;
int main()
{
    int sequence[]={3,2,1,3,1,2,3};
    int val=0,n,ptr=0;
    cin>>n;
    while(val<n)
    {
      val+=sequence[ptr++];
      if(val<=n)
      cout<<val<<" ";
      if(ptr==7)
      {
          ptr=0;
      }
    }   
}