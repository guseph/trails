# Receipt Trail
React.js, Node.js, Firebase, Google Vision API, Semantic UI, Toast UI

## Inspiration 
Lots of people have random paper receipts scattered around their houses or stacked in their wallets. We wanted to create a web app that will manage receipt information in one place for users to easily view later instead of having to track down a physical "paper trail" of receipts! We wanted to make it as easy as possible for people to track and view their expenses, to encourage financial responsibility.

## What it does
Receipt Trail allows users to upload pictures of receipts. It then parses those receipts using the Google Vision AI API and pulls out the total price, the tax amount, and the date of transaction. Users can edit and confirm these values before submitting them to Firebase. The user can manage all their expenses and receipts in the Expenses tab. The user can analyze all the receipts they've added in various graphs (total v. tax, monthly expenses) created by Toast UI. Receipt Trail also supports user creation, user authentication and all receipt data through Firebase.

## What's Next
- Improve receipt parsing that can handle more edge cases and also find individual items, sales, vendor, etc.
- More customized UI
- Better onboarding with a landing page
- Mobile version to allow users to easily take and upload pictures of their receipts
- Create a Chrome Extension to allow users to parse and store digital receipts

## Devpost Link: 
https://devpost.com/software/receipt-trail?ref_content=user-portfolio&ref_feature=in_progress
