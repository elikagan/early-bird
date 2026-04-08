# QA Notes — v0.5.0
Captured: 2026-04-08

> **Architecture decision (Apr 8):** Messages tab is being killed. Communication moves to item detail pages. "Watching" tab replaces Messages + Favorites. Nav becomes Buy / Sell / Watching / Account. Notes marked [OBSOLETE] below were written before this decision and should not be acted on directly — but some sub-points (iMessage input, avatar sizes, contrast) still apply to the new conversation component.

---

## add-item
1. light grays are too light.
2. back button is unlike other back buttons
3. header issues that we've discussed at lenght.
4. post item button can't be hiding off page. needs to be persistant pinned to the bottom. can't be blue until required elements are inputted.
5. i think we should remove "condition". And remove the condition tag from the list on the other page
6. we don't need a market picker. you get here from within an event. But it shoudl say the name of the event your adding this to somewhere on here...
7. Remove the price posture stuff. there shoudl just be a "Price Firm" toggle that defaults to off.
8. When you click add photo it should give choice of photo album or take picture i guess.
9. Need to indicate that the first photo is the main photo. indicate that they can redrag order. but for fucks sake make it the best most buttery drag UIUX in world history. scour the internet for the best code to make the drag work easily 100% of the time. Probalby this means the plus symbol shouldn't be in the top left but rather be the last square in the grid. in this case bottom right...

## admin-dashboard
1. veritcal spacing issues. Recent actions jammed up into thing above it.
2. "Global dashboard"
3. The tab at the top on mobile should be a pull down

## booth-active
1. countdown to the drop.
2. vertical alignment issue within the items. price should be top aligned iwth top of thumbnail.
3. everything flaoting on this page. poor structure. light grays invisible. Maybe the items should be in cards with bgs. Also the live/sold/reslt pills are nearly invisible.
4. countdown is to the drop. if they are getting inquiries it means the it's live. so the countdown should say "early bird market is live. Wouldn't be terrible to say X buyers are shopping... Consider this note for everywhere.
5. i feel like the event name is too subtle here

## booth-empty
1. I think this page should have a countdown to the DROP not the market. Including seconds. This needs to be super emphasized.
3. And then copy needs to be more compelling. "Why not show up to the market ahead $2,500?" be a salesman!
4. Same notes as before about the header.
5. Maybe text says: Add items youre bringing to...
6. How do i get tothe market picker from here?
7. Footer issue — resolved: nav becomes Buy / Sell / Watching / Account.

## booth-fresh
1. The light grays are impossible to read.
2. The buttons can't blue until required info is added
3. "Setup your booth for DWTN Modernism [DATe NEEDED]
4. Add a note around payment info. this is so you can take payment directly from buyers without our involvement. Theres should be payment settings right here. dont make them go to settings. but they can be redundant from that. if you set it up here for one show they should persist. Check on for Venmo (with address). Check on for zelle (with address). Check on for cash only. Does this make sense? i want these right here on this page.
5. This page needs hieratchy. Nothing is big and obvious. And vertical spacing is weird.
6. Light gray makes things look like they're floating. And i dont know waht they need to see FAB or empty booth message until they do this setup. Maybe theres a "skip for now" button. But this setup piece needs to be easily findable on the booth UX.

## booth-picker
1. I don't understand how this picker is initiated.
2. The markets have two dates. The main date is like a part of the event name. that's when the market is. Then theres the countdown to when it goes live and they need to have stuff posted.
3. Select market isn't right. Its more like switch to different event

## compose
1. THIS ISNT the compose page. Theres nothing on this page that relates to "compose" etc
2. I think its because "hold" has been turned on. and by the way as we discuss "hold" is in the wrong place.
3. why no nav?

## item-detail
1. held marker shoudl be up in line with price. aligned right.
2. missing dealer avatar
3. Chat with dealer lives on this page now (PLAN-v3 architecture decision).
4. no nav?

## item-detail-as-dealer
1. footer nav?

## item-detail-held
1. Hold marker in wrong place.
2. no nav?

## item-detail-own
1. i don't see an inquiry list on this page as the QA notes says.
2. Where are the hold/sold butotns?
3. need to be able to edit my item (all info and images)
4. Needs to indicate what markt this is for. weird lacking context i think
5. Inquiries/messages from buyers live on this page now (PLAN-v3: accordion threads per buyer).

THESE NOTES BELOW WERE PREVIOUSLY ABOUT A DEALER LOOKING AT THEIR OWN ITEM WHEN THEY WERE ACTING AS A BUYER WHICH IS A WEIRD EDGE CASE
3. good that it doesn't have a favorite button. also shouldn't have contact buttons. but it doesn't here anyway because hold is on... but actually just because an item is held doesn't mean you should be able to contact the dealer...
4. missing dealer phone number.
5. missing dealer avatar.
6. As discussed i want it to say held by [name] and put his avatar...
7. no nav?

## item-detail-sold
1. sold marker too light and in wrong place as discussed.
2. lacking structure on this page i think
3. Open to offers / condtion will be going away
4. no nav?

## landing-buyer
1. Click here --> Click Here
2. Remove the carrots on the right next to each market.
3. live now / countdown should be aligned right. shouldn't wrap.
4. don't need to say "drops in" just have countdown
5. What i don't understand about the UX here is that after i put in my email address where does that link take me? The market selection is not well thoughtout. I recognize that pretty much only one market will be live at one. sometimes two. but you still need the context to understand taht there is a list of markets etc. My thinking is that this homepage should have a "logged in" version that replaces the "get early access" stuff with something relevant to a logged in shopper. Let's carefully rethink what would be on this page. How does one get back here from other pages? Please ask me questions about this back in claude code if you want clarification.

## landing-dealer
1. "... when items drop the evening before the show"
2. I don't understand why this page doesn't have the Early Bird logo in the header. This is a weird choice you've made to only have the EB logo on two pages.

## feed-populated
1. Dealer avatar tiny
2. contact button the pops drawer with contact tools should be on every item
3. Filter bar reorg as discussed elseehwere
4. picture doesn't go to bottom of container (or container needs to compress up)
5. Nav issue — resolved: becomes Buy / Sell / Watching / Account.

## feed-as-dealer
1. Nav issue — resolved: becomes Buy / Sell / Watching / Account.
2. i've given all other notes elsehwere.

## feed-saved-empty
1. reorg filter as discussed earlier.
2. Nav issue — resolved: becomes Buy / Sell / Watching / Account.

## feed-saved-populated
Same notes as elsewhere. avatar, filter row, contact button.

## feed-filter-sheet
1. i don't think these dropdowns are scalable at all. Consider that there could easily be 100 dealers in the list. what is the best practice for soemthing like that?
2. What are the categories?
3. Probalby the drawer should open up more to accomodate?
4. before drawer slid up i noticed that it has the seller nav...

## onboarding
1. Missing header. wheres the EB logo? Im not insisting that the EB logo belongs here, but i want to understand why its on certain pages an not others. And i want the placement of "Almost there" to be in a rationale place that relates to other pages on the site.
2. This page needs context. "Almost there" --> "Get set up to pre-buy" or something. almost there doesn't really capture whats happening.
3. Why are some elements centered? left align
4. I don't like the look of the circle with that text in it. make it a square with rounded corners. more modern.
5. Also this page needs structure. And the light grays and tiny text are straining my eyes

## settings
this is fine. btw what does the buyer only account page look like?

## settings-buyer
1. on buyer page there is no business.
3. just name and i supose the privacy setting you added

## verify-failure
I don't think links should expire.

---

## [OBSOLETE] Messages screens — superseded by PLAN-v3

> These notes were written about the standalone Messages tab which is being replaced by the Watching tab + inline conversations on item detail pages. The specific UI feedback (avatar sizes, text truncation, iMessage input behavior, contrast) still applies to the new conversation component design.

### conversation
1. Why is the back button different on this page than on the other pages?
2. if feels like stuff is randomly indented too far left.
3. The dealer info and image are tiny
4. The input field needs to act exactly like imessage. its one line but if the text goes past one line the field expands upward. Just copy the exact best practices of that.
5. I feel like the horiz divider above the reply field is too light. i can't really see it.
6. Nav label issue — resolved: Buy / Sell / Watching / Account.
7. Also the light gray on this page and tiny text is impossible to read.

### conversation-seller
1. header issues. inconsistent placement etc.
2. wrong back button.
4. I've given notes on this elsewhere.
5. text Input field needs to behave like imessage.
6. light grays illegible
7. avatar feels small.
8. weird left indent at top.

### messages-buyer
1. avatars too small.
2. should these be cards with bgs?
3. waht does a new/unread message look like?
4. as discussed elsewhere put up to four lines of text in this view. why not prioritize functionality.

### messages-empty
1. Looks ok.
2. Nav issue — resolved.
3. Buyer wouldn't have a selling tab at the top right? — resolved by killing Messages tab.

### messages-populated
1. I feel like the avatars are too small.
2. i don't think you should limit the display length of these messages to one line here. why not show the whole message. or at least allow it to expand to four lines before truncating. We want to maximize functionality.
3. Need to add a marker indicating if the status of the item has changed. Sold to me. Held for me. etc.
4. There should be a date indicator.
5. Same header issue.
7. This needs to be sorted by object by default. — resolved by PLAN-v3: dealer inquiries live on item detail page, grouped by item.
