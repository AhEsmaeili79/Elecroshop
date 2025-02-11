from django.utils import timezone
from persiantools.jdatetime import JalaliDate
import pytz

def get_persian_datetime():
    
    iran_tz = pytz.timezone('Asia/Tehran')
    
    now = timezone.now().astimezone(iran_tz)
    
    persian_date = JalaliDate(now).strftime('%Y-%m-%d')
    
    persian_time = now.strftime('%H:%M:%S')
    
    return persian_date, persian_time
