
from django.shortcuts import render, get_object_or_404, redirect
from django.views import View

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from charity_donation.models import Category, Institution, Donation
from django.contrib.auth.mixins import LoginRequiredMixin


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


class AddDonation(LoginRequiredMixin, View):
    def get(self, request):
        categories = Category.objects.all()
        institutions = Institution.objects.all()
        if request.user.is_authenticated:
            user = request.user
        else:
            user = None
        return render(request, "form.html", {"user": user, "categories": categories, "institutions": institutions})

    def post(self, request):
        if request.POST.get("form-type") == "donation-form":
            return redirect('form-confirmation')
        if request.POST.get("form-type") == "contact-form":
            return redirect('register')

        # categories_id = request.POST.getlist('categories')
        # categories = Category.objects.filter(id__in=categories_id).distinct()
        # quantity = request.POST.get('bags')
        # institution = get_object_or_404(Institution, id=request.POST.get('organization'))
        # address = request.POST.get('address')
        # city = request.POST.get('city')
        # zip_code = request.POST.get('postcode')
        # phone_number = request.POST.get('phone')
        # pick_up_date = request.POST.get('data')
        # pick_up_time = request.POST.get('time')
        # pick_up_comment = request.POST.get('more_info')
        # new_donation = Donation.objects.create(quantity=quantity,
        #                                        institution=institution,
        #                                        address=address,
        #                                        phone_number=phone_number,
        #                                        city=city,
        #                                        zip_code=zip_code,
        #                                        pick_up_date=pick_up_date,
        #                                        pick_up_time=pick_up_time,
        #                                        pick_up_comment=pick_up_comment,
        #                                        user=request.user)
        # new_donation.categories.add(*categories)
        # new_donation.save()
        # return redirect('form-confirmation')


class FormConfirmationView(View):
    def get(self, request):
        return render(request, 'form-confirmation.html')


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


class LogoutView(View):
    def get(self, request):
        # Log out the user
        logout(request)

        # Redirect the user to the login page
        return redirect('index')


class ProfilView(LoginRequiredMixin, View):
    def get(self, request):
        donations = Donation.objects.filter(user=request.user).order_by('-pick_up_date')
        user_bags = 0
        institutions = []
        for donation in donations:
            user_bags += donation.quantity
            if donation.institution not in institutions:
                institutions.append(donation.institution)
        user_institutions = len(institutions)
        return render(request, 'profil.html', {'donations': donations,
                                                'user_bags': user_bags,
                                                'user_institutions': user_institutions})










