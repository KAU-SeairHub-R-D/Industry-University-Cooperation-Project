package com.seairhub.driver.config

import android.app.Application
import android.content.SharedPreferences
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

class ApplicationClass : Application() {
    val API_URL = "https://www.woojae.tk/"

    // 코틀린의 전역변수 문법
    companion object {
        // 만들어져있는 SharedPreferences 를 사용, 재생성하지 않도록 유념
        lateinit var sSharedPreferences: SharedPreferences

        // JWT Token Header 키 값
        const val X_ACCESS_TOKEN = "X-ACCESS-TOKEN"

        // User Idx
        const val User_Idx = "User-Idx"

        // Retrofit 인스턴스, 앱 실행시 한번만 생성하여 사용
        lateinit var sRetrofit: Retrofit

        // FCM 메세지 토큰
        lateinit var messageToken: String
    }

    // 앱이 처음 생성되는 순간, SP를 새로 만들어주고, 레트로핏 인스턴스를 생성
    override fun onCreate() {
        super.onCreate()
        // SharedPreferences 생성
        sSharedPreferences = applicationContext.getSharedPreferences("sp_seairhub_driver", MODE_PRIVATE)

        // User Idx 초기화
        sSharedPreferences.edit().putInt(User_Idx, -1).apply()
        println("유저 아이디 초기화 : " + sSharedPreferences.getInt(User_Idx, -1))

        // 레트로핏 인스턴스 생성
        initRetrofitInstance()
    }

    // 레트로핏 인스턴스를 생성, 레트로핏에 각종 설정값들을 지정
    // 연결 타임아웃시간은 5초로 지정, HttpLoggingInterceptor를 붙여서 어떤 요청이 나가고 들어오는지를 보여줌
    private fun initRetrofitInstance() {
        val client: OkHttpClient = OkHttpClient.Builder()
            .readTimeout(5000, TimeUnit.MILLISECONDS)
            .connectTimeout(5000, TimeUnit.MILLISECONDS)
            // 로그캣에 okhttp.OkHttpClient로 검색하면 http 통신 내용을 보여줌
            .addInterceptor(HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BODY))
            .addNetworkInterceptor(XAccessTokenInterceptor()) // JWT 자동 헤더 전송
            .build()

        // sRetrofit 이라는 전역변수에 API url, 인터셉터, Gson을 넣어주고 빌드해주는 코드
        // 이 전역변수로 http 요청을 서버로 전송
        sRetrofit = Retrofit.Builder()
            .baseUrl(API_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
}