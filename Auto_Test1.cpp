#include<iostream>
using namespace std;

class Auto{
    public:
  string marka;
  int model;
  int god;

string ispis_marka(string marka);
int ispis_model(int model);
int ispis_god(int god);
};

string Auto::ispis_marka(string marka){
    return marka;
}

int Auto::ispis_model(int model){
    return model;
}

int Auto::ispis_god(int god){
    return god;
}

int main(){
       Auto auto1, auto2;

       string a;
       int b,c;

    cin>>a;
    cin>>b;
    cin>>c;

       auto1.marka="Ferrari";
       auto1.model=458;
       auto1.god=2016;

    cout<<auto1.ispis_marka(auto1.marka)<<endl;
    cout<<auto1.ispis_model(auto1.model)<<endl;
    cout<<auto1.ispis_god(auto1.god)<<endl;

       auto2.marka=a;
       auto2.model=b;
       auto2.god=c;
       
     cout<<auto2.ispis_marka(a)<<endl;
     cout<<auto2.ispis_model(b)<<endl;
     cout<<auto2.ispis_god(c)<<endl;

return 0;
}