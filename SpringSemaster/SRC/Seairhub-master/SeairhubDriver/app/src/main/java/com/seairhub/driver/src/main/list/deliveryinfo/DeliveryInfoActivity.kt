package com.seairhub.driver.src.main.list.deliveryinfo

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.view.MenuItem
import androidx.fragment.app.Fragment
import com.google.firebase.ktx.Firebase
import com.google.firebase.storage.ktx.storage
import com.seairhub.driver.R
import com.seairhub.driver.config.BaseActivity
import com.seairhub.driver.databinding.ActivityDeliveryInfoBinding
import java.text.SimpleDateFormat

class DeliveryInfoActivity : BaseActivity<ActivityDeliveryInfoBinding>(ActivityDeliveryInfoBinding::inflate) {
    private var currentImageURI : Uri? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        set()

        replaceFragment(DeliveryInfoFragment())
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            android.R.id.home -> {
                finish()
            }
        }

        return super.onOptionsItemSelected(item)
    }

    private fun replaceFragment(F : Fragment) {
        supportFragmentManager.beginTransaction().replace(R.id.fl, F).commitAllowingStateLoss()
    }

    private fun set() {
        setSupportActionBar(binding.toolbar)
        supportActionBar!!.setDisplayHomeAsUpEnabled(true)
    }

    internal fun openGallery() {
        val intent = Intent(Intent.ACTION_PICK)
        intent.type = MediaStore.Images.Media.CONTENT_TYPE
        startActivityForResult(intent, 201)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (resultCode == RESULT_OK){
            when (requestCode) {
                201 -> {
                    currentImageURI = data?.data
                    uploadImage() //업로드
                }
                else -> {showCustomToast("갤러리 요청 코드 오류")}
            }
        }
        else{
            println("ActivityResult, something wrong")
        }
    }

    private fun uploadImage() {
        //파이어베이스 사진 업로드
        val storage = Firebase.storage
        val storageRef = storage.reference

        val currentTime = System.currentTimeMillis() // ms로 반환
        val dataFormat1 = SimpleDateFormat("yyyyMMdd") // 년 월 일
        val dataFormat2 = SimpleDateFormat("HHmmss") // 시(0~23) 분 초
        val pathString =
                "${dataFormat1.format(currentTime)}_" +
                "${dataFormat2.format(currentTime)}_"

        val imageRef = storageRef.child("test/$pathString")
        val uploadTask = imageRef.putFile(currentImageURI!!)

        // Register observers to listen for when the download is done or if it fails
        uploadTask.addOnFailureListener {
            // Handle unsuccessful uploads
            showCustomToast("업로드 실패, $it")
            println("업로드 실패, $it")
        }.addOnSuccessListener { taskSnapshot ->
            // taskSnapshot.metadata contains file metadata such as size, content-type, etc.
            showCustomToast("업로드 성공")
            println("$taskSnapshot")
        }
    }
}