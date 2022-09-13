package com.seairhub.driver.src.splash

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.messaging.FirebaseMessaging
import com.seairhub.driver.config.ApplicationClass
import com.seairhub.driver.config.BaseActivity
import com.seairhub.driver.databinding.ActivitySplashBinding
import com.seairhub.driver.src.main.MainActivity

class SplashActivity : BaseActivity<ActivitySplashBinding>(ActivitySplashBinding::inflate) {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        showLoadingDialog(this)
        Handler(Looper.getMainLooper()).postDelayed({
            dismissLoadingDialog()

            FirebaseMessaging.getInstance().token.addOnCompleteListener (OnCompleteListener {
                if (!it.isSuccessful) {
                    println("Fetching FCM registration token failed : ${it.exception}")
                    return@OnCompleteListener
                }

                ApplicationClass.messageToken = it.result
                println("Refreshed token : ${ApplicationClass.messageToken}")

                // 토큰 처리
            })

            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }, 2000)
    }
}