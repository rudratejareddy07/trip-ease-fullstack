const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const listingSchema=new Schema({
    title:{ type:String,
        required:true},
    description :String,
    image :{ type:String,
        default :"https://www.google.com/search?sca_esv=8cb62c52412f1e47&rlz=1C1CHBF_enIN1165IN1165&sxsrf=AE3TifPKTZo-2qxoSaoIkXawJmBl8FUkSg:1750314916489&q=no+copyright+photos+beach&udm=2&fbs=AIIjpHxU7SXXniUZfeShr2fp4giZ1Y6MJ25_tmWITc7uy4KIemkjk18Cn72Gp24fGkjjh6wQFVCbKXb4P6swJy4x5wjmjSNJGQvRsKm6-XgTruVwk9DhM0x_AsXZQrPrMy1jKlMYnZ3rpb0LoKV96Ggfo7Xcyzl_roog1j43qwSTLLa3s1YhaD5tvE0GhLZJj3D0xgbpho3J4zZUE7sySXzXikUuNkhRaA&sa=X&ved=2ahUKEwjht96W7_yNAxVpd_UHHV1fHCEQtKgLegQIFhAB&biw=1536&bih=730&dpr=1.25#vhid=8QZ2psdDFpZXdM&vssid=mosaic",
        set:(v)=>v ===""?"https://www.google.com/search?sca_esv=8cb62c52412f1e47&rlz=1C1CHBF_enIN1165IN1165&sxsrf=AE3TifPKTZo-2qxoSaoIkXawJmBl8FUkSg:1750314916489&q=no+copyright+photos+beach&udm=2&fbs=AIIjpHxU7SXXniUZfeShr2fp4giZ1Y6MJ25_tmWITc7uy4KIemkjk18Cn72Gp24fGkjjh6wQFVCbKXb4P6swJy4x5wjmjSNJGQvRsKm6-XgTruVwk9DhM0x_AsXZQrPrMy1jKlMYnZ3rpb0LoKV96Ggfo7Xcyzl_roog1j43qwSTLLa3s1YhaD5tvE0GhLZJj3D0xgbpho3J4zZUE7sySXzXikUuNkhRaA&sa=X&ved=2ahUKEwjht96W7_yNAxVpd_UHHV1fHCEQtKgLegQIFhAB&biw=1536&bih=730&dpr=1.25#vhid=8QZ2psdDFpZXdM&vssid=mosaic":v,
    },

    price :Number,
    location:String,
    country :String,
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;