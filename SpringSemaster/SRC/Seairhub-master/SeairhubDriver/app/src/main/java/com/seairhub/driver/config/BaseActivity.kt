package com.seairhub.driver.config

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.viewbinding.ViewBinding
import com.seairhub.driver.util.LoadingDialog

// 액티비티의 기본을 작성, 뷰 바인딩 활용
abstract class BaseActivity<B : ViewBinding>(private val inflate: (LayoutInflater) -> B) :
    AppCompatActivity() {
    protected lateinit var binding: B
        private set
    lateinit var mLoadingDialog: LoadingDialog

    // 뷰 바인딩 객체를 받아서 inflate, 화면 생성
    // 즉 매번 onCreate에서 setContentView를 할 필요가 없음
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = inflate(layoutInflater)
        setContentView(binding.root)
    }

    // 로딩 다이얼로그, 즉 로딩창을 생성
    // 네트워크가 시작될 때 사용자가 무작정 기다리게 하지 않기 위해 작성
    fun showLoadingDialog(context: Context) {
        mLoadingDialog = LoadingDialog(context)
        mLoadingDialog.show()
    }

    // 띄워 놓은 로딩 다이얼로그 삭제
    fun dismissLoadingDialog() {
        if (mLoadingDialog.isShowing) {
            mLoadingDialog.dismiss()
        }
    }

    // 토스트 메세지
    fun showCustomToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}