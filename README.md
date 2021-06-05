# **PanicAlarm**<br>

IOT based smart watch to monitor unusuall activity of heart, alert the care takers when the person **(differently abled, elders, childern)** wearing the watch are in danger or in need of help.<br />
There can be any sudden situation of panic. It could be an intruder entering our house or bad health status. Situations can be many for panicking and may vary from person to person. During these situations we employ the use of **_Panic Alarm Watch_**, which can automatically or just by pressing a button alert our well-wishers.
<br />
<br />

## _Table of Contents_

- [User Guide](#user-guide)
  - [Registration & Access Token](#registration-&-access-token)
  - [Watch Setup](#watch-setup)
- [Developers](#developers)
  - [Watch Architecture](#watch-architecture)
  - [Watch Working Model](#watch-model)
  - [Dashboard](#dashboard)
  - [Dashboard API](#dashboard-api)

## User Guide

To start using the watch the user must register on the [PanicAlarm](#https://panicalarm.vercel.app) dashboard, obtain a user access token and use it with the watch.

### **Registration & Access Token**

The registration is very simple, visit [PanicAlarm](#https://panicalarm.vercel.app) dashboard and fill all your details correctly.<br />

![User Registration](https://res.cloudinary.com/shaiqkar/image/upload/v1622921885/Github/Screenshot_from_2021-06-06_01-04-26_rrhv9d.png)

After registration you will be redirected to login. Upon successfully logging in you can see your dashboard

![User Dashboard](https://res.cloudinary.com/shaiqkar/image/upload/v1622921885/Github/Screenshot_from_2021-06-06_01-05-48_ntp0p0.png)

On the left side is your unique 24 digit Alert Id _(click on it to copy)_. All the alerts generated from the watch will appear on the right side. The dashboard aggregates the alerts of similar type to a set timeout. For example if an automatic alert was sent at 10:00 AM, then all the upcoming automatic alerts till 11:00 AM (Default Aggregation TimeOut is 1 hour) will be aggregated with the first generated alert.

![Alerts](https://res.cloudinary.com/shaiqkar/image/upload/v1622921886/Github/Screenshot_from_2021-06-06_01-06-23_optniv.png)

## **Watch Setup**
