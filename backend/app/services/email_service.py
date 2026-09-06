import resend

from ..core.config import (
    RESEND_API_KEY,
    MAIL_FROM,
    ADMIN_EMAIL
)


# =========================================================
# RESEND CONFIGURATION
# =========================================================

resend.api_key = RESEND_API_KEY


# =========================================================
# WELCOME EMAIL
# =========================================================

def send_welcome_email(
    customer_email: str,
    customer_name: str
):

    display_name = (
        customer_name or "Customer"
    )

    params: resend.Emails.SendParams = {

        "from": MAIL_FROM,

        "to": [
            customer_email
        ],

        "subject":
            "Welcome to Osprey Fasteners",

        "html": f"""
        <div style="
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            color: #111;
            max-width: 650px;
            margin: 0 auto;
        ">

            <h2 style="color: #000;">
                Welcome to Osprey Fasteners
            </h2>

            <p>
                Hello
                <strong>
                    {display_name}
                </strong>,
            </p>

            <p>
                Welcome to Osprey Fasteners!
                Your account has been
                successfully created.
            </p>

            <p>
                You can now log in to your account
                and browse our fastener products,
                add products to your quote,
                and submit quote requests.
            </p>

            <p>
                We look forward to serving you.
            </p>

            <br>

            <p>
                Best Regards,<br>
                <strong>
                    Osprey Fasteners
                </strong>
            </p>

        </div>
        """
    }

    return resend.Emails.send(
        params
    )


# =========================================================
# QUOTE CONFIRMATION EMAIL
# =========================================================

def send_quote_confirmation(
    customer_email: str,
    customer_name: str,
    quote_number: str
):

    params: resend.Emails.SendParams = {

        "from": MAIL_FROM,

        "to": [
            customer_email
        ],

        "subject":
            f"Thank You for Your Enquiry - "
            f"{quote_number}",

        "html": f"""
        <div style="
            font-family: Arial, sans-serif;
            line-height: 1.6;
        ">

            <h2>
                Thank You for Your Enquiry
            </h2>

            <p>
                Hello {customer_name},
            </p>

            <p>
                Thank you for your enquiry.
            </p>

            <p>
                Your Quote Number is
                <strong>
                    {quote_number}
                </strong>.
            </p>

            <p>
                We will get back to you
                within 48 hours.
            </p>

            <br>

            <p>
                Best Regards,<br>
                <strong>
                    Osprey Fasteners
                </strong>
            </p>

        </div>
        """
    }

    return resend.Emails.send(
        params
    )


# =========================================================
# ADMIN QUOTE NOTIFICATION
# =========================================================

def send_admin_notification(
    customer_name: str,
    customer_email: str,
    quote_number: str,
    company_name: str
):

    if not ADMIN_EMAIL:
        return

    params: resend.Emails.SendParams = {

        "from": MAIL_FROM,

        "to": [
            ADMIN_EMAIL
        ],

        "subject":
            f"New Quote Request - "
            f"{quote_number}",

        "html": f"""
        <div style="
            font-family: Arial, sans-serif;
            line-height: 1.6;
        ">

            <h2>
                New Quote Request
            </h2>

            <p>
                <strong>
                    Quote Number:
                </strong>
                {quote_number}
            </p>

            <p>
                <strong>
                    Customer:
                </strong>
                {customer_name}
            </p>

            <p>
                <strong>
                    Company:
                </strong>
                {company_name or "N/A"}
            </p>

            <p>
                <strong>
                    Email:
                </strong>
                {customer_email}
            </p>

            <p>
                A new quote request has
                been submitted through the
                Osprey Fasteners website.
            </p>

        </div>
        """
    }

    return resend.Emails.send(
        params
    )