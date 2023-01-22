from django.shortcuts import render, redirect
from django.views import View
from django.http import HttpResponse

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from charity_donation.models import Category, Institution, Donation
# Create your views here.
class LandingPage(View):
    def get(self, request):
        type1 = Institution.objects.filter(type=1)
        type2 = Institution.objects.filter(type=2)
        type3 = Institution.objects.filter(type=3)
        num_institutions = len(list(Institution.objects.all()))
        num_donations = len(list(Donation.objects.all()))
        ctx = {"num_institutions": num_institutions,
               "num_donations": num_donations,
               "type1": type1,
               "type2": type2,
               "type3": type3}
        return render(request, "index.html", ctx)


class AddDonation(View):
    def get(self, request):
        return render(request, "form.html")


class Login(View):
    def get(self, request):
        return render(request, "login.html")

    def post(self, request):
        email = request.POST.get("email")
        password = request.POST.get("password")
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return redirect("index")
        else:
            return render(request, 'login.html', {'error': 'Wrong username or password'})




class Register(View):
    def get(self, request):
        return render(request, "register.html")

    def post(self, request):

        name = request.POST.get("name")
        surname = request.POST.get("surname")
        email = request.POST.get("email")
        password = request.POST.get("password")
        password2 = request.POST.get("password2")

        if password == password2:
            user = User.objects.create_user(username=email, email=email, password=password, first_name=name, last_name=surname)
        else:
            return render(request, 'register.html', {'error': 'Passwords do not match'})

        return redirect('login')


